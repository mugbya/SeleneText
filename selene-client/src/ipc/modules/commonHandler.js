const { dialog, ipcMain, BrowserWindow } = require('electron');

function registerCommonHandlers() {

  ipcMain.handle("show-alert", async (event, {msg}) => {
    console.log("show-alert %s", msg)
    dialog.showMessageBox({
      type: "info",
      msg,
      buttons: ["确定"],
    });
  });


}

module.exports = {
  registerCommonHandlers,
};
