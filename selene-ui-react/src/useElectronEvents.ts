import { useEffect } from "react";
import type { Folder } from "@/types";
import { toast } from "sonner";
import { handleFileSave } from "@/logic/fileSaver";
import { useProjectsStore } from "./store/useProjectStore";

export function useElectronEvents() {

  const addProject = useProjectsStore((s) => s.addProject);
  const closeProject = useProjectsStore((s) => s.closeProject);
  const closeProjectByPath = useProjectsStore((s) => s.closeProjectByPath);
  const updateProject = useProjectsStore((s) => s.updateProject);

  /**
   * 监听打开文件夹操作，加载文件夹
   *  还处理了 项目标签相关逻辑
   * @param folder
   */
  const loadFolder = async (folder: Folder) => {
    console.log("[useElectronEvents] load-folder folder: ", folder);
    const { projects, } = useProjectsStore.getState(); // 💥 get 最新状态
    const exists = Object.values(projects ?? {}).some(item => item.rootPath === folder.basePath);
    if (exists) {
      folderChangedHandler(folder);
      // toast.info("项目已经被打开"); // 你用的 UI 通知组件
    } else {
      console.log("新增文件夹.....");
      addProject(folder);
    }
  }

  /**
   * 关闭文件夹
   */
  const closeFolderHandler = async () => {
    const { activeProjectId } = useProjectsStore.getState(); // 💥 get 最新状态
    closeProject(activeProjectId);
  }

  const folderDeletedHandler = async (rootPath: string) => {
    console.log("[ipcRenderer] folder-deleted:", rootPath);
    toast.error(`项目目录已被删除：${rootPath}`, {
      className: "truncate", // 相当于 overflow-hidden + text-ellipsis + whitespace-nowrap
    });
    useProjectsStore.getState().closeProjectByPath(rootPath); // 你可以添加这个函数
  }

  /**
   * 文件夹内容变化 刷新整个文件树
   * @param folder 
   * @returns 
   */
  const folderChangedHandler = async (folder: Folder) => {
    console.log("[ipcRenderer] folder-changed:", folder);
    if (!folder) {  // 文件夹为空，不处理
      console.warn("文件夹为空，不处理");
      return;
    }

    const { basePath, contents } = folder;

    const { projects, } = useProjectsStore.getState(); // 💥 get 最新状态

    // 查找已存在的项目 ID（根据 basePath 匹配）
    const existingProject = Object.values(projects).find(
      (p) => p.rootPath === basePath
    );

    if (!existingProject) {
      console.warn("项目不存在，跳过 folder-changed 处理");
      return;
    }

    // 更新文件树
    updateProject(existingProject.id, () => ({
      folderTree: {
        name: folder.basePath.split('/').pop() || 'Project',  // 根目录名称
        path: folder.basePath,                 // 根目录完整路径
        isDirectory: true,
        children: contents                     // ✅ 子项是数组
      }
    }));
  };


  // 文件保存处理
  const saveHandler = async () => {
    console.log("[useElectronEvents] saveHandler start");
    const {
      orphanFiles,
      activeOrphanFile,
      getActiveProject,
    } = useProjectsStore.getState(); // 💥 get 最新状态

    const project = getActiveProject();

    console.log("[useElectronEvents] saveHandler project: ", project, "orphanFiles: ", orphanFiles);
    const openFiles = project?.openFiles ?? orphanFiles;

    console.log("[useElectronEvents] saveHandler openFiles: ", openFiles);

    const currentFile =
      project?.openFiles.find((f) => f.path === project.lastActiveFile) ||
      orphanFiles.find((f) => f.path === activeOrphanFile);

    console.log("[useElectronEvents] saveHandler current: ", currentFile);
    await handleFileSave(currentFile);
  };

  useEffect(() => {
    console.log(`[useElectronEvents] 执行....`);
    const api = window.electronAPI;
    if (!api?.on) {
      console.warn("⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置");
      return;
    }

    // 监听主程序发送的 replace-folders 事件。 刷新整个工作区域 放置 打开的文件夹
    api.on("load-folder", loadFolder); //  监听打开文件夹操作，加载文件夹
    api.on("close-folder", closeFolderHandler);
    api.on("folder-changed", folderChangedHandler);
    api.on("folder-deleted", folderDeletedHandler);
    api.on("file-save", saveHandler);



    return () => {
      api.removeAllListeners("load-folder");
      api.removeAllListeners("close-folder");
      api.removeAllListeners("folder-changed");
      api.removeAllListeners("folder-deleted");
      api.removeAllListeners("file-save");
    };
  }, []);
}