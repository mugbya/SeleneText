// src/menu/fileMenu.js
const { dialog } = require('electron');

/**
 * 文件菜单配置
 * @param {BrowserWindow} win
 * @returns {Electron.MenuItemConstructorOptions}
 */
function createFileMenu(win) {
  return {
    label: '文件',
    submenu: [
      {
        label: '新建文本文件',
        click: () => {
          console.log('新建文本文件');
          // TODO: 发 IPC 给渲染进程处理
        },
      },
      {
        label: '新建目录',
        click: () => {
          console.log('新建目录');
        },
      },
      { type: 'separator' },
      {
        label: '打开文件',
        click: async () => {
          const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            properties: ['openFile'],
          });
          if (!canceled) {
            console.log('打开文件:', filePaths);
          }
        },
      },
      {
        label: '打开文件夹',
        click: async () => {
          const { canceled, filePaths } = await dialog.showOpenDialog(win, {
            properties: ['openDirectory'],
          });
          if (!canceled) {
            console.log('打开文件夹:', filePaths);
          }
        },
      },
      {
        label: '打开最新的文件',
        click: () => {
          console.log('打开最新的文件');
        },
      },
      { type: 'separator' },
      {
        label: '将文件夹添加到工作区',
        click: () => {
          console.log('添加文件夹到工作区');
        },
      },
      { type: 'separator' },
      {
        label: '关闭文件夹',
        click: () => {
          console.log('关闭文件夹');
        },
      },
    ],
  };
}

module.exports = { createFileMenu };
