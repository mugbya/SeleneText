import { useEffect } from "react";
import type { FileTab, Folder, ProjectTab } from "@/types";
import { useProjectsStore } from "./store/projectsStore";
import { toast } from "sonner";
import { handleFileSave } from "@/logic/fileSaver";

export function useElectronEvents() {

  const addProject = useProjectsStore((s) => s.addProject);
  const projects = useProjectsStore((s) => s.projects);
  const updateProject = useProjectsStore((s) => s.updateProject);
  const setActiveProjectId = useProjectsStore((s) => s.setActiveProjectId);
  const getActiveProject = useProjectsStore((s) => s.getActiveProject);
  const updateOrphanFileContent = useProjectsStore((s) => s.updateOrphanFileContent);
  const orphanFiles = useProjectsStore((s) => s.orphanFiles);
  const activeOrphanFile = useProjectsStore((s) => s.activeOrphanFile);

  /**
    * 监听打开文件夹操作，加载文件夹
   *  还处理了 项目标签相关逻辑
    * @param folder 
    */
  const loadFolder = async (folder: Folder) => {
    console.log("[useElectronEvents] load-folder folder: ", folder);
    const exists = Object.values(projects ?? {}).some(item => item.rootPath === folder.basePath);
    if (exists) {
      toast.info("项目已经被打开"); // 你用的 UI 通知组件
    } else {
      console.log("新增文件夹.....");
      addProject(folder);
    }
  }

  const folderChangedHandler = async (folder: Folder) => {
    console.log("[ipcRenderer] folder-changed:", folder);
    if (!folder) {  // 文件夹为空，不处理
      console.warn("文件夹为空，不处理");
      return;
    }

    const { basePath, contents } = folder;

    const {
      projects,
    } = useProjectsStore.getState(); // 💥 get 最新状态

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
      console.log("[useElectronEvents] saveHandler");

      const {
        orphanFiles,
        activeOrphanFile,
        getActiveProject,
      } = useProjectsStore.getState(); // 💥 get 最新状态

      const project =  getActiveProject();

      console.log("[useElectronEvents] project: ", project, "orphanFiles: ", orphanFiles);
      const openFiles = project?.openFiles ?? orphanFiles;
    
      console.log("[useElectronEvents] openFiles: ", openFiles);

      const currentFile =
      project?.openFiles.find((f) => f.path === project.lastActiveFile) ||
      orphanFiles.find((f) => f.path === activeOrphanFile);

      // const currentFile =
      // project?.openFiles.find((f) => f.path === project.lastActiveFile) ||
      // orphanFiles.find((f) => f.path === activeOrphanFile);

      // console.log("[useElectronEvents] saveHandler openFiles: ", openFiles);
      // if (!openFiles) {
      //   console.warn("❌ saveHandler 调用失败：openFiles is null or undefined");
      //   return;
      // };

      // const activeFile = getActiveProject()?.lastActiveFile;
      // const current = openFiles.find((f) => f.path === activeFile);

      // if (openFiles) {
      console.log("[useElectronEvents] current: ", currentFile);
      await handleFileSave(currentFile, (oldPath, updated) => {
        // const newFiles = openFiles.map((f) => (f.path === oldPath ? updated : f));

        // setOpenFiles(newFiles);
        // setActiveFile(updated.path);

        // // 保存项目状态
        // if (activeProjectId) {
        //   useProjectsStore.getState().updateProjectFiles(activeProjectId, newFiles, updated.path);
        // }
      });
      // }
    };

  useEffect(() => {
    console.log(`[useElectronEvents] 执行....`);
    const api = window.electronAPI;
    if (!api?.on) {
      console.warn("⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置");
      return;
    }


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



    // const handleSaveFile = async (file: FileTab) => {
    //   console.log("[useElectronEvents] handleSaveFile file: ", file);
    //   if (file.isTemporary || !file.realPath) {
    //     // 调用 Electron 的 save dialog，让用户选择保存路径
    //     const { filePath } = await window.electronAPI.showSaveDialog({
    //       defaultPath: file.path,
    //     });
    
    //     if (filePath) {
    //       // 写入文件
    //       await window.electronAPI.writeFile(filePath, file.content);
    
    //       // 更新 file 实例的状态
    //       // updateOrphanFileContent(file.path, filePath, false);
    //       // updateOrphanFileContent(
    //       //   filePath: file.path, 
    //       //   realPath: filePath,
    //       //   isTemporary: false,
    //       // );
    //     }
    //   } else {
    //     // 已有路径，直接保存
    //     await window.electronAPI.writeFile(file.realPath, file.content);
    //   }
    // };
    
    // 监听主程序发送的 replace-folders 事件。 刷新整个工作区域 放置 打开的文件夹
    api.on("load-folder", loadFolder); //  监听打开文件夹操作，加载文件夹
    api.on("file-save", saveHandler);
    // api.on("file-save", handleSaveFile);
    api.on("folder-changed", folderChangedHandler);

    // api.on('folder-changed', (_, folderPath: string) => {
    //   console.log("监听到文件变化，刷新文件树：", folderPath);
    //   loadFolder(folderPath); // 重新读取并渲染文件树
    // });



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
      api.removeAllListeners("load-folder");
      api.removeAllListeners("folder-changed");
      //     api.removeAllListeners("replace-folders");
      //     api.removeAllListeners("append-folder");
      //     api.removeAllListeners("replace-folder");
    };
    // }, [openFiles, activeFile, setOpenFiles, setActiveFile, activeProjectId, addProject, updateProjectFiles, getActiveProject, setActiveProjectId]);
  }, []);
}