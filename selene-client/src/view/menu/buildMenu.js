const { Menu } = require('electron');
const path = require('path')
const createFileMenu = require(path.join(global.__root, 'src/view/menu/fileMenu'));  // 引入自定义菜单模块
const createAppMenu = require(path.join(global.__root, 'src/view/menu/appMenu'));        // 👈 新增 appMenu 模块


let currentLang = 'zh'; // 默认语言

function buildAppMenu(lang = 'zh') {

    const menuTemplate = [];

    const { getMainWindow } = require(path.join(global.__root, 'src/view/windowManager')); // 避免循环依赖
    const win = getMainWindow();

    // 👇 macOS 特有的 App 菜单（位于左上角）
    console.log("process.platform: ", process.platform)
    if (process.platform === 'darwin') {
        menuTemplate.push(createAppMenu(win));
    }

    // 👇 通用菜单项
    menuTemplate.push(
        createFileMenu(win),
        {
            label: '编辑',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }, // ✅ 必须有这个，才能启用 Cmd+A
            ],
        }
    );

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

function getCurrentLang() {
    return currentLang;
}

module.exports = {
    buildAppMenu,
    getCurrentLang,
};