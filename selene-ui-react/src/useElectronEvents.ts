import { useEffect } from "react";
import { handleFileSave } from "@/logic/fileSaver";
import type { FileTab, ProjectTab } from "@/types";
import { useProjectsStore } from "./store/projectsStore";
import { useFileTreeStore } from "./store/fileTreeStore";

export function useElectronEvents() {
  useEffect(() => {

    console.log(`[useElectronEvents] 执行....`);

    const api = window.electronAPI;
    if (!api?.on) {
      console.warn("⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置");
      return;
    }


    // 处理创建项目标签的事件
    const createProjectTabHandler = (folderPath: string) => {
      // 如果是第一次打开文件夹，创建项目标签
      const projectId = useProjectsStore.getState().addProject(folderPath);
      useProjectsStore.getState().setActiveProjectId(projectId);
    };

    // 处理在新标签页打开文件夹的事件
    const openProjectTabHandler = (folderPath: string) => {
      const projectId = useProjectsStore.getState().addProject(folderPath);
      useProjectsStore.getState().setActiveProjectId(projectId);
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

    // 打开项目处理
    const openProjectHandler = (folderPath: string) => {
      // console.
      // addProject(folderPath);
    };

    // 监听主程序发送的 replace-folders 事件。 刷新整个工作区域 放置 打开的文件夹
    api.on("replace-folders", (foldersList) => {
      // if (Array.isArray(foldersList)) {
      // //   setFolders(foldersList);
      // useFileTreeStore.getState().setTree();
      // } else {
      //   console.warn("replace-folders payload 应该是数组:", foldersList);
      // }
      // if (Array.isArray(foldersList)) {
      //   foldersList.forEach((folder) => {
      //     if (folder?.basePath && Array.isArray(folder.contents)) {
      //       useFileTreeStore.getState().setTree(folder); // 设置其中一个项目
      //     } else {
      //       console.warn("无效的 FolderTree 数据结构:", folder);
      //     }
      //   });
      // } else {
      //   console.warn("replace-folders payload 应该是数组:", foldersList);
      // }
      if (Array.isArray(foldersList)) {
        useFileTreeStore.getState().setTrees(foldersList);
      }
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
    // api.on('open-project-tab', openProjectHandler);
    api.on('create-project-tab', createProjectTabHandler);
    api.on('open-project-tab', openProjectTabHandler);


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
      api.removeAllListeners("open-project-tab");
      api.removeAllListeners('create-project-tab');
      api.removeAllListeners("replace-folders");
    };
    // }, [openFiles, activeFile, setOpenFiles, setActiveFile, activeProjectId, addProject, updateProjectFiles, getActiveProject, setActiveProjectId]);
  }, []);
}