const { ipcMain } = require('electron');
const path = require('path')
const { buildAppMenu } = require(path.join(global.__root, 'src/view/menu/buildMenu'));

function registerLanguageHandlers() {

    ipcMain.on("set-language", (event, lang) => {
        i18n.changeLanguage(lang).then(() => {
            buildAppMenu(); // ✅ 主动重新构建菜单
        });
    });

}

module.exports = {
    registerLanguageHandlers,
};
