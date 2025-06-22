const { dialog, ipcMain, BrowserWindow } = require('electron');
const path = require('path')
const { getMainWindow } = require(path.join(global.__root, 'src/view/windowManager'));


function registerCommonHandlers() {

  // ipcMain.handle("show-alert", async (event, {msg}) => {
  //   console.log("show-alert %s", msg)
  //   dialog.showMessageBox({
  //     type: "info",
  //     msg,
  //     buttons: ["确定"],
  //   });
  // });

  ipcMain.on('toggle-devtools', () => {
    const mainWindow = getMainWindow();
    if (!mainWindow) return;
    const webContents = mainWindow.webContents;
    if (webContents.isDevToolsOpened()) {
      webContents.closeDevTools();
    } else {
      webContents.openDevTools({ mode: 'detach' });
    }
  });

}

module.exports = {
  registerCommonHandlers,
};
