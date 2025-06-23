const { contextBridge, ipcMain } = require('electron')
// const Store = require('electron-store')
const Store = require('electron-store').default
const store = new Store({ name: 'SeleneText-store' })

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