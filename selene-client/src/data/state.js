
const path = require("path");
const Store = require('electron-store').default
const { watchFolder } = require(path.join(global.__root, 'src/utils/watchFolder'));

// electron-store 存储数据
const store = new Store({ name: 'SeleneText-store' })

// 在主程序中 全局定义一个 roots 数组，用于存储所有的根目录。
let roots = new Set(); // 存储所有的根目录

function addRoot(p) {
  roots.add(path.resolve(p));
}

function getRoots() {
  return [...roots];
}

function setRoots(list) {
  roots.clear();
  list.forEach(p => roots.add(path.resolve(p)));
}

// 如果需要删除根目录
function removeRoot(p) {
  roots.delete(path.resolve(p));
}

function restoreWatchedFolders(win) {
  if (!win) return console.log('⚠️ 主窗口未加载完成');

  const projectsData = store.get('projectsData') || {}
  console.log('📁 恢复监听文件夹:', projectsData);

  if (!projectsData) return console.log('⚠️ 未找到缓存的项目数据');

  const projectMap = projectsData["projects"];

  Object.keys(projectMap).forEach((projectId) => {
    const project = projectMap[projectId];
    // console.log("当前项目: ", projectId, project);
    const folderPath = project?.rootPath;

    // 检查是否已经在监听中
    // console.log('📁 恢复监听:', folderPath);
    
    if (folderPath) {
       watchFolder(folderPath, win); // 监听文件夹
    }
  });
}

module.exports = {
  store,
  restoreWatchedFolders,

  addRoot,
  removeRoot,
  getRoots,
  setRoots,
};
