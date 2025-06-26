const path = require('path');
const { throttle } = require('lodash');
const { app, BrowserWindow } = require('electron');
const chokidarLib = require('chokidar'); // ✅ 只写一次
const { readDirRecursive } = require(path.join(global.__root, 'src/utils/fsUtils'));
const folderWatchers = new Map(); // ✅ JS 里不写泛型 允许动态 watch 多个文件夹 防止重复监听

const isDev = !app.isPackaged;
const ignoreTag = isDev ? '.prod_' : '.dev_';
const logTag = isDev ? '[DEV]' : '[PROD]';

/**
 * @param {string} folderPath - 要监听的目录
 * @param {BrowserWindow} window - Electron 窗口
 */
function watchFolder(folderPath, window) {
  // console.log('[watchFolder] 📁 已经监听的文件夹数据: ', folderWatchers);
  console.log(`[watchFolder] ${logTag} 监听文件夹: ${folderPath}`);
  if (folderWatchers.has(folderPath)) {
    folderWatchers.get(folderPath).close();
  }

  const watcher = chokidarLib.watch(folderPath, {
    // ignored: /(^|[/\\])\../, // 忽略 .git 等隐藏文件
    ignored: (filePath) => filePath.includes(ignoreTag) || /(^|[/\\])\../.test(filePath),
    persistent: true,
    ignoreInitial: true,
    depth: 99
  });

  /**
   * 发送文件夹变化
   *  需要考虑触发太频繁的情况
   *  比如文件保存时, 会触发很多次
   *  所以需要节流
   *  最多每 1000ms 执行一次
   *  这样可以避免频繁发送消息
   *  但是会导致文件保存时, 会有一定的延迟
   * @param {string} folderPath 文件夹路径
   * @param {BrowserWindow} window 窗口
   */
  const throttledSendUpdate = throttle(() => {
    // console.log('发送文件夹变化, 路径: ', folderPath);
    console.log(`${logTag} 文件夹变化: ${folderPath}`);
    const contents = readDirRecursive(folderPath);
    // console.log('目录结构：', contents); // 👈 添加这行
    window.webContents.send('folder-changed', {
      basePath: folderPath,
      contents,
    });
  }, 1000); // 最多每 1000ms 执行一次

  watcher.on('add', throttledSendUpdate);
  watcher.on('unlink', throttledSendUpdate);
  watcher.on('change', throttledSendUpdate);
  watcher.on('addDir', throttledSendUpdate);
  watcher.on('unlinkDir', throttledSendUpdate);

  folderWatchers.set(folderPath, watcher);
}

module.exports = {
  watchFolder,
};
