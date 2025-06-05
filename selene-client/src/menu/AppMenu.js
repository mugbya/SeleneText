const { app, Menu } = require('electron');

function createAppMenu(win) {
  const appName = app.name || 'Selene Text';
  return {
    label: appName,
    submenu: [
      { role: 'about', label: `关于 ${appName}` },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide', label: `隐藏 ${appName}` },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit', label: `退出 ${appName}` },
    ],
  };
}

module.exports = createAppMenu; // ✅ 一定要导出这个函数

