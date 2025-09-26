const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {

  dirname: (filePath) => path.dirname(filePath),
  basename: (filePath) => path.basename(filePath),
  join: (...args) => path.join(...args),
  resolvePath: (p) => path.resolve(p),

  send: (channel, data) => ipcRenderer.send(channel, data),

  toggleDevTools: () => ipcRenderer.send('toggle-devtools'),

  getImageBase64: (imagePath) => 
    ipcRenderer.invoke('image-base64', imagePath),

  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },

  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),


  readFile: (filePath) =>
    ipcRenderer.invoke('read-file', {filePath}),

  saveFileAs: (filePath, content) =>
    ipcRenderer.invoke('save-file-as', { filePath, content }),

  saveFile: (filePath, content) =>
    ipcRenderer.invoke('save-file', { filePath, content }),

  createFile: (dir, name) =>
    ipcRenderer.invoke('create-file', { dir, name }),

  createFolder: (dir, name) =>
    ipcRenderer.invoke('create-folder', { dir, name }),

  renamePath: (rootPath, oldPath, newName) =>
    ipcRenderer.invoke('rename-path', { rootPath, oldPath, newName }),

  deletePath: (targetPath) =>
    ipcRenderer.invoke('delete-path', { targetPath }),

  moveFile: (rootPath, sourcePath, targetDir) =>
    ipcRenderer.invoke('move-file', { rootPath, sourcePath, targetDir }),

  loadFolder: ()  =>
    ipcRenderer.invoke('delete-path', { targetPath }),


  /**
   * 提供 IPC 读写接口 - 数据缓存 使用 electron-store
   */
  getProjectsStore: () => ipcRenderer.invoke('get-projects-store'),
  setProjectsStore: (data) => ipcRenderer.invoke('set-projects-store', data),

  // 备份和安全写入相关API
  // backupFile: (filePath) => ipcRenderer.invoke('backup-file', filePath),

  /**
   * 安全写方法
   * @param filePath
   * @param originFilePath
   * @param data
   * @returns {Promise<any>}
   */
  saveFileSafely: (filePath, originFilePath, data) => ipcRenderer.invoke('save-file-safely', { filePath, originFilePath, data }),
  // restoreFromBackup: (filePath) => ipcRenderer.invoke('restore-from-backup', filePath),
  // markFileOpen: (filePath) => ipcRenderer.invoke('mark-file-open', filePath),
  // markFileClosed: (projectRootPath, filePath) => ipcRenderer.invoke('mark-file-closed', projectRootPath, filePath),

  /**
   * 获取临时文件的根目录
   * @returns {Promise<any>}
   */
  getUserDateFileBackPath: () => ipcRenderer.invoke('get-user-date-file-back-path'),

  // showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  // writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),

  // showAlert: (msg) =>
  //   ipcRenderer.invoke('show-alert', { msg }),
  // onOpenProjectTab: (callback: (folderPath: string) => void) => {
  //   ipcRenderer.on("open-project-tab", (_, folderPath) => callback(folderPath));
  // },

});
