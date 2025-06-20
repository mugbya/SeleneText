import { useEffect } from "react";
// import { handleFileSave } from "@/logic/fileSaver";
import type { FileTab, Folder, ProjectTab } from "@/types";
import { useProjectsStore } from "./store/projectsStore";
// import { useFileTreeStore } from "./store/fileTreeStore";
import { toast } from "sonner";
import { handleFileSave } from "@/logic/fileSaver";

export function useElectronEvents() {

  const addProject = useProjectsStore((s) => s.addProject);
  const projects = useProjectsStore((s) => s.projects);
  const updateProject = useProjectsStore((s) => s.updateProject);
  // const getProjects = useProjectsStore((s) => s.getProjects);
  const setActiveProjectId = useProjectsStore((s) => s.setActiveProjectId);
  const getActiveProject = useProjectsStore((s) => s.getActiveProject);

  // const setTrees = useFileTreeStore((s) => s.setTrees);
  // const setTree = useFileTreeStore((s) => s.setTree);

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

    // 文件保存处理
    const saveHandler = async () => {
      console.log("[useElectronEvents] saveHandler");
      console.log("[useElectronEvents] saveHandler - 1");

      const openFiles = getActiveProject()?.openFiles;
      if (!openFiles) return;

      const activeFile = getActiveProject()?.lastActiveFile;
      const current = openFiles.find((f) => f.path === activeFile);

      // if (openFiles) {
      console.log("[useElectronEvents] current: ", current);
      await handleFileSave(current, (oldPath, updated) => {
        const newFiles = openFiles.map((f) => (f.path === oldPath ? updated : f));

        // setOpenFiles(newFiles);
        // setActiveFile(updated.path);

        // // 保存项目状态
        // if (activeProjectId) {
        //   useProjectsStore.getState().updateProjectFiles(activeProjectId, newFiles, updated.path);
        // }
      });
      // }

    };


    // 监听主程序发送的 replace-folders 事件。 刷新整个工作区域 放置 打开的文件夹
    // api.on("load-folder", (folder) => {
    // })


    api.on("load-folder", loadFolder); //  监听打开文件夹操作，加载文件夹
    api.on("file-save", saveHandler);
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