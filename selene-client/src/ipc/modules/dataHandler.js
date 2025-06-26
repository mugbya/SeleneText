const path = require("path");
const { ipcMain } = require('electron')
const { store } = require(path.join(global.__root, 'src/data/state'));


function registerDataHandlers() {

    // 提供 IPC 读写接口
    ipcMain.handle('get-projects-store', () => {
        return store.get('projectsData') || {}
    })

    ipcMain.handle('set-projects-store', (event, data) => {
        store.set('projectsData', data)
        return true
    })
}

module.exports = {
    registerDataHandlers,
}