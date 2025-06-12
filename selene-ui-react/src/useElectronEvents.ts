import { useEffect } from "react";
import { handleFileSave } from "@/logic/fileSaver";
import type { FileTab, ProjectTab } from "@/types";
import { useProjectsStore } from "./store/projectsStore";
// import { useFileTreeStore } from "./store/fileTreeStore";

export function useElectronEvents() {

  const addProject = useProjectsStore((s) => s.addProject);
  const projects = useProjectsStore((s) => s.projects);
  const setActiveProjectId = useProjectsStore((s) => s.setActiveProjectId);

  // const setTrees = useFileTreeStore((s) => s.setTrees);
  // const setTree = useFileTreeStore((s) => s.setTree);

  useEffect(() => {
    console.log(`[useElectronEvents] 执行....`);
    const api = window.electronAPI;
    if (!api?.on) {
      console.warn("⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置");
      return;
    }

    // api.removeAllListeners("file-save");
    // api.removeAllListeners("open-project-tab");
    // api.removeAllListeners('create-project-tab');
    // api.removeAllListeners("replace-folders");


    // 处理创建项目标签的事件
    // const createProjectTabHandler = (folderPath: string) => {
    //   // 如果是第一次打开文件夹，创建项目标签
    //   const projectId = addProject(folderPath);
    //   setActiveProjectId(projectId);
    // };

    // // 处理在新标签页打开文件夹的事件
    // const openProjectTabHandler = (folderPath: string) => {
    //   const projectId = addProject(folderPath);
    //   setActiveProjectId(projectId);
    // };

    // ✅ 创建文件/文件夹逻辑
    const handleNewFile = async (dirPath: string) => {
      const res = await window.electronAPI.createFile(dirPath, "新建文件.txt");
      if (res.success) {
        // 简单做法：重新加载整个目录
        window.electronAPI.send("refresh-folder", dirPath);
      }
    };

    const handleNewFolder = async (dirPath: string) => {
      const res = await window.electronAPI.createFolder(dirPath, "新建文件夹");
      if (res.success) {
        window.electronAPI.send("refresh-folder", dirPath);
      }
    };

    // 文件保存处理
    const saveHandler = async () => {
      // const current = openFiles.find((f) => f.path === activeFile);
      // await handleFileSave(current, (oldPath, updated) => {
      //   const newFiles = openFiles.map((f) => (f.path === oldPath ? updated : f));
      //   setOpenFiles(newFiles);
      //   setActiveFile(updated.path);

      //   // 保存项目状态
      //   if (activeProjectId) {
      //     useProjectsStore.getState().updateProjectFiles(activeProjectId, newFiles, updated.path);
      //   }
      // });
    };


    // 监听主程序发送的 replace-folders 事件。 刷新整个工作区域 放置 打开的文件夹
    api.on("load-folder", (folder) => {
      console.log("[useElectronEvents] load-folder folder: ", folder);
      // if (Array.isArray(foldersList)) {

      projects.some(item => {
        const exists = item.rootPath?.toString().includes(folder.folder) // 确保处理undefined和类型转换
        if (exists) {
          console.log("项目已经被打开")
          return
        };
      });

      const projectId = addProject(folder);
      setActiveProjectId(projectId);
      console.log("[useElectronEvents] load-folder addProject projectId:", projectId);
    });

    // 监听主程序发送的 append-folder 事件。 追加 打开的文件夹
    //   api.on("append-folder", ({ basePath, contents }) => {
    //     const normalizedNew = api.resolvePath(basePath);
    //     setFolders((prev) => {
    //       const exists = prev.some(
    //         (f) => api.resolvePath(f.basePath) === normalizedNew
    //       );
    //       if (exists) return prev; // ❌ 已存在就跳过
    //       return [...prev, { basePath, contents }]; // ✅ 新文件夹
    //     });
    //   });

    //   api.on("replace-folder", ({ basePath, contents }) => {
    //     setFolders((prev) =>
    //       prev.map((folder) =>
    //         api.resolvePath(folder.basePath) === api.resolvePath(basePath)
    //           ? { basePath, contents }
    //           : folder
    //       )
    //     );
    //   });

    api.on("file-save", saveHandler);
    // api.on('create-project-tab', createProjectTabHandler);
    // api.on('open-project-tab', openProjectTabHandler);


    // 如果切换了项目，更新UI状态
    // if (activeProjectId) {
    //   const project = getActiveProject();
    //   if (project && project.openFiles) {
    //     console.log("[useFileSaveListener] activeProjectId: ", activeProjectId, ", project: ", project);
    //     setOpenFiles(project.openFiles);
    //     setActiveFile(project.lastActiveFile ?? "");
    //   }
    // }

    return () => {
      api.removeAllListeners("file-save");
      // api.removeAllListeners("open-project-tab");
      // api.removeAllListeners('create-project-tab');
      api.removeAllListeners("load-folder");
      //     api.removeAllListeners("replace-folders");
      //     api.removeAllListeners("append-folder");
      //     api.removeAllListeners("replace-folder");
    };
    // }, [openFiles, activeFile, setOpenFiles, setActiveFile, activeProjectId, addProject, updateProjectFiles, getActiveProject, setActiveProjectId]);
  }, []);
}