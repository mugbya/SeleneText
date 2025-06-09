const { app, Menu } = require('electron');
const path = require('path')
const i18n = require(path.join(global.__root, 'src/i18n/i18n.main.js'));

function createAppMenu(win) {
  const t = i18n.t.bind(i18n);

  const appName = app.name || 'Selene Text';
  return {
    label: appName,
    submenu: [
      { role: 'about', label: `${t("menu.about")} ${appName}` },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      {
          label: t('menu.language'),
          click: () => {
            win?.webContents.send('open-language-dialog'); // 👈 通知渲染进程弹出语言选择 UI
          },
        },
      { type: 'separator' },
      { role: 'hide', label: `${t("menu.hide")} ${appName}` },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit', label: `${t("menu.quit")}  ${appName}` },
    ],
  };
}

module.exports = createAppMenu; // ✅ 一定要导出这个函数

