// src/i18n/i18n.main.js (主进程)
// const path = require('path');
const i18next = require('i18next');
// const Backend = require('i18next-fs-backend');

// i18next.use(Backend).init({
//   lng: 'zh',
//   fallbackLng: 'en',
//   backend: {
//     loadPath: path.join(__dirname, '../locales/{{lng}}.json'), // 复用 UI 语言包
//   },
// });

i18next.init({
  lng: 'zh', // 表示当前使用的默认语言是中文（zh）
  fallbackLng: 'en', // 如果某个 key 在 zh 中找不到，会回退（fallback）到 en 中查找
  resources: {
    zh: {
      translation: {
        menu: {
          about: "关于",
          quit: "退出",
          language: "语言切换",
          hide: "隐藏",
          services: "服务",

          file: "文件",
          open: "打开",
          save: "保存",
          edit: "编辑",

          openFolder: "打开文件夹",
          addFoldersToWorkspace: "添加文件夹到工作区",
        },
      },
    },
    en: {
      translation: {
        menu: {
          about: "About Us",
          quit: "Quit",
          language: "Language Switching",
          hide: "Hide",
          services: "Services",


          file: "File",
          open: "Open",
          save: "Save",
          edit: "Edit",

          openFolder: "Open Folder",
          addFoldersToWorkspace: "Add Folder to Workspace",
        },
      },
    },
  },
});

module.exports = i18next;