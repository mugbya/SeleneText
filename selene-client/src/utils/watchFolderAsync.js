// src/utils/watchFolderAsync.js
const path = require('path');
const fs = require('fs').promises;
const chokidarLib = require('chokidar');
const { throttle } = require('lodash');

const folderWatchers = new Map();
const throttledTimers = new Map();

const isDev = process.env.NODE_ENV !== 'production';
const ignoreTag = isDev ? '.prod_' : '.dev_';
const logTag = isDev ? '[DEV]' : '[PROD]';

/**
 * 异步递归读取文件夹内容
 * @param {string} folderPath
 * @returns {Promise<Object>} 目录结构对象
 */
async function readDirRecursiveAsync(folderPath) {
  const result = {};
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name.includes(ignoreTag)) continue;
      const fullPath = path.join(folderPath, entry.name);
      if (entry.isDirectory()) {
        result[entry.name] = await readDirRecursiveAsync(fullPath);
      } else {
        result[entry.name] = 'file';
      }
    }
  } catch (err) {
    console.error(`${logTag} readDirRecursiveAsync error:`, err);
  }
  return result;
}

/**
 * 安全发送消息到渲染进程
 */
function safeSend(win, channel, ...args) {
  if (!win || win.isDestroyed() || !win.webContents || win.webContents.isDestroyed()) return;
  win.webContents.send(channel, ...args);
}

/**
 * 开始监听文件夹
 */
function watchFolder(folderPath, window) {
  console.log(`[watchFolder] ${logTag} 监听文件夹: ${folderPath}`);

  // 关闭已存在 watcher
  if (folderWatchers.has(folderPath)) {
    folderWatchers.get(folderPath).close();
    folderWatchers.delete(folderPath);
  }

  const watcher = chokidarLib.watch(folderPath, {
    // ignored: (filePath) => filePath.includes(ignoreTag) || /(^|[/\])\../.test(filePath),
    ignored: (filePath) => filePath.includes(ignoreTag) || /(^|[/\\])\../.test(filePath),
    persistent: true,
    ignoreInitial: true,
    depth: 99,
    usePolling: false,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    },
    disableGlobbing: true // 避免使用glob模式，减少内部fs.Stats使用
  });

  const throttledSendUpdate = throttle(async () => {
    const contents = await readDirRecursiveAsync(folderPath);
    safeSend(window, 'folder-changed', { basePath: folderPath, contents });
  }, 1000);

  // 保存 throttle 实例用于 stopAllWatchers
  throttledTimers.set(folderPath, throttledSendUpdate);

  // 绑定事件
  ['add', 'unlink', 'change', 'addDir', 'unlinkDir'].forEach((event) => {
    watcher.on(event, throttledSendUpdate);
  });

  folderWatchers.set(folderPath, watcher);
}

/**
 * 停止所有 watcher
 */
function stopAllWatchers() {
  console.log(`[watchFolder] ${logTag} stopAllWatchers, 数量: ${folderWatchers.size}`);
  for (const [folder, watcher] of folderWatchers.entries()) {
    watcher.close();
    console.log(`[watchFolder] 关闭 watcher: ${folder}`);
  }
  folderWatchers.clear();

  // 取消所有 throttle
  for (const [folder, timer] of throttledTimers.entries()) {
    timer.cancel();
  }
  throttledTimers.clear();
}

async function stopAllWatchersAsync() {
  console.log(`[watchFolder] ${logTag} stopAllWatchersAsync, 数量: ${folderWatchers.size}`);

  const closePromises = [];
  for (const [folder, watcher] of folderWatchers.entries()) {
    try {
      // 使用Promise.race添加超时处理
      const closePromise = Promise.race([
        watcher.close(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Watcher close timeout')), 1000))
      ]).catch(err => {
        console.warn(`[watchFolder] 关闭watcher超时: ${folder}`, err.message);
      });
      closePromises.push(closePromise);
    } catch (err) {
      console.error(`[watchFolder] 关闭watcher错误: ${folder}`, err);
    }
  }

  try {
    await Promise.all(closePromises);
  } catch (err) {
    console.error('[watchFolder] 关闭watcher错误:', err);
  }
  
  folderWatchers.clear();
  throttledTimers.forEach(timer => timer.cancel());
  throttledTimers.clear();
}

/**
 * 恢复监听
 * @param {BrowserWindow} window
 * @param {ElectronStore} store
 */
async function restoreWatchedFolders(window, store) {
  if (!window || window.isDestroyed()) return;

  // 异步延迟执行，保证 webContents 已准备
  setImmediate(async () => {
    const projectsData = store.get('projectsData') || {};
    console.log(`[watchFolder] ${logTag} 恢复监听文件夹:`, projectsData);

    if (!projectsData.projects) return;

    const projectMap = projectsData.projects;

    for (const projectId of Object.keys(projectMap)) {
      const folderPath = projectMap[projectId]?.rootPath;
      if (folderPath) {
        watchFolder(folderPath, window);
      }
    }
  });
}

module.exports = {
  watchFolder,
  stopAllWatchers,
  stopAllWatchersAsync,
  restoreWatchedFolders,
};