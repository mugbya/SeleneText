// contextBridge.exposeInMainWorld('electronAPI', {
//     readFile: (filePath) => fs.readFile(filePath, 'utf-8'),
//     send: (channel, data) => ipcRenderer.send(channel, data),
//     on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
//     invoke: (channel, data) => ipcRenderer.invoke(channel, data),
//     resolvePath: (p) => path.resolve(p)
// });

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

  invoke: (channel, data) => ipcRenderer.invoke(channel, data),

  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  resolvePath: (p) => path.resolve(p),


  saveFile: (filePath, content) => fs.writeFile(filePath, content, 'utf-8'),

  saveAsFile: async (content) => {
    const result = await dialog.showSaveDialog({
      title: '保存文件',
      defaultPath: 'untitled.txt',
    });
    if (!result.canceled && result.filePath) {
      await fs.writeFile(result.filePath, content, 'utf-8');
      return result.filePath;
    }
    return null;
  },

  saveFileAs: (defaultPath, content) =>
    ipcRenderer.invoke('save-file-as', { defaultPath, content }),

});


