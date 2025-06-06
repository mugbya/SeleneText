const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs').promises;

contextBridge.exposeInMainWorld('electronAPI', {
    readFile: (filePath) => fs.readFile(filePath, 'utf-8'),
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data)
});


