const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath) => fs.readFile(filePath, 'utf-8'),

  send: (channel, data) => ipcRenderer.send(channel, data),

  // on: (channel, callback) => {
  //   ipcRenderer.on(channel, (event, data) => {
  //     if (data) callback(data);
  //   });
  // },

  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },

  // invoke: (channel, data) => ipcRenderer.invoke(channel, data),

  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  resolvePath: (p) => path.resolve(p),

  saveFileAs: (path, content) =>
    ipcRenderer.invoke('save-file-as', { path, content }),

  saveFile: (path, content) =>
    ipcRenderer.invoke('save-file', { path, content }),

  createFile: (dir, name) =>
    ipcRenderer.invoke('create-file', { dir, name }),

  createFolder: (dir, name) =>
    ipcRenderer.invoke('create-folder', { dir, name }),

  renamePath: (oldPath, newName) =>
    ipcRenderer.invoke('rename-path', { oldPath, newName }),

  deletePath: (targetPath) =>
    ipcRenderer.invoke('delete-path', { targetPath }),

  // onOpenProjectTab: (callback: (folderPath: string) => void) => {
  //   ipcRenderer.on("open-project-tab", (_, folderPath) => callback(folderPath));
  // },
  
});


