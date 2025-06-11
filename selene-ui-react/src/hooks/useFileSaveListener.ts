// // hooks/useFileSaveListener.ts
import { useEffect } from "react";
import { handleFileSave } from "@/logic/fileSaver";
import type { FileTab, ProjectTab } from "@/types";

// import { FileTab, ProjectTab } from "@/types";

// /**
//  * 文件保存监听器
//  * @param openFiles 
//  * @param activeFile 
//  * @param setOpenFiles 
//  * @param setActiveFile 
//  */
// export function useFileSaveListener(openFiles: FileTab[], 
//   activeFile: string | null, 
//   setOpenFiles: React.Dispatch<React.SetStateAction<FileTab[]>>, 
//   setActiveFile: (file: string) => void,
//   addProject: (folderPath: string) => void,
// ) {
//   useEffect(() => {
//     const api = window.electronAPI;
//     if (!api?.on) {
//       console.warn("⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置");
//       return;
//     }

//     const handler = async () => {
//       const current = openFiles.find((f) => f.path === activeFile);
//       await handleFileSave(current, (oldPath, updated) => {
//         setOpenFiles((prev) =>
//           prev.map((f) => (f.path === oldPath ? updated : f))
//         );
//         setActiveFile(updated.path);
//       });
//     };

//     api.on("file-save", handler);
//     api.on?.('open-project-tab', (folderPath: string) => {
//       addProject(folderPath); // 自动分配 ID 并添加标签页
//     });

//     return () => {
//       api.removeAllListeners?.("file-save");
//     };
//   }, [openFiles, activeFile, setOpenFiles, setActiveFile]);
// }

// hooks/useFileSaveListener.ts
export function useFileSaveListener(
  openFiles: FileTab[], 
  activeFile: string | null, 
  setOpenFiles: React.Dispatch<React.SetStateAction<FileTab[]>>, 
  setActiveFile: (file: string | null) => void,
  addProject: (folderPath: string) => string,
  activeProjectId: string | null,
  setActiveProjectId: (projectId: string | null) => void,
  updateProjectFiles: (projectId: string, openFiles: FileTab[], activeFile: string | null) => void,
  getActiveProject: () => ProjectTab | null
) {
  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.on) {
      console.warn("⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置");
      return;
    }

    // 处理创建项目标签的事件
    const createProjectTabHandler = (folderPath: string) => {
      // 如果是第一次打开文件夹，创建项目标签
      const projectId = addProject(folderPath);
      setActiveProjectId(projectId);
    };
    
    // 处理在新标签页打开文件夹的事件
    const openProjectTabHandler = (folderPath: string) => {
      const projectId = addProject(folderPath);
      setActiveProjectId(projectId);
    };

    // 文件保存处理
    const saveHandler = async () => {
      const current = openFiles.find((f) => f.path === activeFile);
      await handleFileSave(current, (oldPath, updated) => {
        const newFiles = openFiles.map((f) => (f.path === oldPath ? updated : f));
        setOpenFiles(newFiles);
        setActiveFile(updated.path);
        
        // 保存项目状态
        if (activeProjectId) {
          updateProjectFiles(activeProjectId, newFiles, updated.path);
        }
      });
    };

    // 打开项目处理
    const openProjectHandler = (folderPath: string) => {
      // console.
      addProject(folderPath);
    };

    api.on("file-save", saveHandler);
    // api.on('open-project-tab', openProjectHandler);
    api.on('create-project-tab', createProjectTabHandler);
    api.on('open-project-tab', openProjectTabHandler);

    // 如果切换了项目，更新UI状态
    if (activeProjectId) {
      const project = getActiveProject();
      if (project && project.openFiles) {
        setOpenFiles(project.openFiles);
        setActiveFile(project.lastActiveFile ?? "");
      }
    }
    
    return () => {
      api.removeAllListeners("file-save");
      api.removeAllListeners("open-project-tab");
      api.removeAllListeners('create-project-tab');
    };
  }, [openFiles, activeFile, setOpenFiles, setActiveFile, activeProjectId, addProject, updateProjectFiles, getActiveProject, setActiveProjectId]);
}