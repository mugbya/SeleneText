const path = require('path');
const fs = require('fs');
const { throttle } = require('lodash');
const { app } = require('electron');
const { readDirRecursive } = require(path.join(global.__root, 'src/utils/fsUtils'));

// 存储所有的监听器和定时器
const folderWatchers = new Map();
const folderCheckIntervals = new Map();
const pendingEvents = new Map(); // 用于存储待处理的事件

const isDev = !app.isPackaged;
const ignoreTag = isDev ? '.prod_' : '.dev_';
const logTag = isDev ? '[DEV]' : '[PROD]';

/**
 * 安全发送消息到渲染进程
 */
function safeSend(window, channel, payload) {
  if (window && !window.isDestroyed() && window.webContents && !window.webContents.isDestroyed()) {
    window.webContents.send(channel, payload);
  } else {
    console.warn(`[nativeWatchFolder] ⚠️ 尝试发送消息到已销毁的窗口: ${channel}`);
  }
}

/**
 * 递归监听目录及其子目录
 * @param {string} rootPath - 根目录路径
 * @param {Function} callback - 文件变化回调
 * @param {Set<string>} watchedPaths - 已监听的路径集合
 */
function watchRecursive(rootPath, callback, watchedPaths = new Set()) {
  if (watchedPaths.has(rootPath)) return;
  
  try {
    // 监听当前目录，使用非持久化模式以便更快退出
    const watcher = fs.watch(rootPath, { persistent: false }, (eventType, filename) => {
      if (!filename) return;
      
      const fullPath = path.join(rootPath, filename);
      
      // 忽略隐藏文件和特定标记的文件
      if (filename.startsWith('.') || filename.includes(ignoreTag)) return;
      
      // 触发回调
      callback(eventType, fullPath);
      
      // 如果是目录变化，可能需要更新监听，但限制递归深度
      try {
        // 使用更轻量的方式检查是否为目录
        if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory() && 
            !watchedPaths.has(fullPath) && 
            watchedPaths.size < 1000) { // 限制监听器数量
          watchRecursive(fullPath, callback, watchedPaths);
        }
      } catch (err) {
        // 文件可能已被删除，忽略错误
      }
    });
    
    // 记录已监听的路径
    watchedPaths.add(rootPath);
    
    // 返回watcher以便后续清理
    return watcher;
  } catch (err) {
    console.error(`[nativeWatchFolder] 监听目录失败: ${rootPath}`, err);
    return null;
  }
}

/**
 * 实时监听文件或目录的变化：比如新增、修改、删除、重命名
 * @param {string} folderPath - 要监听的目录
 * @param {BrowserWindow} window - Electron 窗口
 */
function watchFolder(folderPath, window) {
  console.log(`[nativeWatchFolder] ${logTag} 监听文件夹: ${folderPath}`);
  
  // 关闭已存在的监听，使用更高效的清理方式
  if (folderWatchers.has(folderPath)) {
    const { watchers, watchedPaths } = folderWatchers.get(folderPath);
    // 快速关闭监听器，不等待
    watchers.forEach(watcher => {
      if (watcher) {
        try {
          watcher.close();
        } catch (err) {
          // 忽略关闭错误
        }
      }
    });
    folderWatchers.delete(folderPath);
  }
  
  // 清除已存在的检查间隔
  if (folderCheckIntervals.has(folderPath)) {
    clearInterval(folderCheckIntervals.get(folderPath));
    folderCheckIntervals.delete(folderPath);
  }
  
  // 节流函数，减少频繁更新
  const throttledSendUpdate = throttle(() => {
    console.log(`${logTag} 文件夹变化: ${folderPath}`);
    const contents = readDirRecursive(folderPath);
    safeSend(window, 'folder-changed', {
      basePath: folderPath,
      contents,
    });
  }, 1000);
  
  // 存储所有子目录的监听器
  const watchers = [];
  const watchedPaths = new Set();
  
  // 处理文件变化事件 - 简化版本
  const handleFileChange = (eventType, filePath) => {
    // 将事件添加到待处理队列
    if (!pendingEvents.has(folderPath)) {
      pendingEvents.set(folderPath, new Set());
    }
    pendingEvents.get(folderPath).add(filePath);
    
    // 触发更新
    throttledSendUpdate();
    
    // 限制监听器的数量，只在必要时添加新的监听
    if (watchedPaths.size < 500) { // 设置合理的上限
      try {
        // 使用更轻量的方式检查是否为目录
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
          // 递归监听新目录
          const newWatcher = watchRecursive(filePath, handleFileChange, watchedPaths);
          if (newWatcher) watchers.push(newWatcher);
        }
      } catch (err) {
        // 忽略错误，文件可能已被删除
      }
    }
  };
  
  // 初始化监听
  try {
    // 读取目录结构
    const dirs = [folderPath];
    const processedDirs = new Set();
    
    // 广度优先遍历目录结构，但限制监听深度
    let depth = 0;
    const MAX_DEPTH = 6; // 限制监听深度
    const MAX_DIRS = 100; // 限制监听目录数量
    
    while (dirs.length > 0 && processedDirs.size < MAX_DIRS && depth < MAX_DEPTH) {
      const currentLevel = dirs.length;
      depth++;
      
      // 处理当前层级的所有目录
      for (let i = 0; i < currentLevel && processedDirs.size < MAX_DIRS; i++) {
        const currentDir = dirs.shift();
        if (processedDirs.has(currentDir)) continue;
        processedDirs.add(currentDir);
        
        // 监听当前目录
        const watcher = watchRecursive(currentDir, handleFileChange, watchedPaths);
        if (watcher) watchers.push(watcher);
        
        // 只在较浅层次获取子目录
        if (depth < MAX_DEPTH) {
          try {
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) {
              if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.includes(ignoreTag)) {
                const subDir = path.join(currentDir, entry.name);
                dirs.push(subDir);
              }
            }
          } catch (err) {
            // 忽略错误，继续处理其他目录
          }
        }
      }
    }
    
    console.log(`[nativeWatchFolder] 监听了 ${processedDirs.size} 个目录，深度 ${depth}，路径: ${folderPath}`);
    
    // 存储监听器信息
    folderWatchers.set(folderPath, { watchers, watchedPaths });
    
    // 定期检查目录是否存在，但使用更长的间隔
    const interval = setInterval(() => {
      if (!fs.existsSync(folderPath)) {
        console.warn(`[nativeWatchFolder] ⚠️ 文件夹已被删除: ${folderPath}`);
        
        // 清理监听器 - 快速清理，不等待
        const { watchers } = folderWatchers.get(folderPath) || { watchers: [] };
        watchers.forEach(watcher => {
          if (watcher) {
            try {
              watcher.close();
            } catch (err) {
              // 忽略关闭错误
            }
          }
        });
        folderWatchers.delete(folderPath);
        
        // 清理定时器
        clearInterval(interval);
        folderCheckIntervals.delete(folderPath);
        
        // 通知渲染进程
        console.log('[nativeWatchFolder] 发送文件夹删除通知');
        safeSend(window, 'folder-deleted', folderPath);
      }
    }, 10000); // 增加间隔到10秒，减少系统负担
    
    folderCheckIntervals.set(folderPath, interval);
    
  } catch (err) {
    console.error(`[nativeWatchFolder] 监听文件夹失败: ${folderPath}`, err);
  }
}

/**
 * 清理所有监听器
 */
const cleanupWatchers = () => {
  console.log('[nativeWatchFolder] 清理所有监听器...');
  
  // 立即清理所有定时器，这是最快的操作
  for (const [folderPath, interval] of folderCheckIntervals.entries()) {
    clearInterval(interval);
  }
  folderCheckIntervals.clear();
  
  // 清理待处理事件
  pendingEvents.clear();
  
  // 尝试关闭所有文件监听器，但不等待
  for (const [folderPath, { watchers }] of folderWatchers.entries()) {
    try {
      watchers.forEach(watcher => {
        if (watcher) {
          try {
            // 设置一个非常短的超时，避免watcher.close()可能阻塞
            const closeTimeout = setTimeout(() => {
              console.log(`[nativeWatchFolder] 监听器关闭超时: ${folderPath}`);
            }, 50);
            
            watcher.close();
            clearTimeout(closeTimeout);
          } catch (innerErr) {
            console.error(`[nativeWatchFolder] 关闭单个watcher错误: ${folderPath}`, innerErr);
          }
        }
      });
    } catch (err) {
      console.error(`[nativeWatchFolder] 关闭watcher组错误: ${folderPath}`, err);
    }
  }
  folderWatchers.clear();
};

module.exports = {
  watchFolder,
  cleanupWatchers
};