// import { ProjectTab } from "@/types";
// import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";

// // export interface Project {
// //   id: string;
// //   name: string;
// //   rootPath: string;
// // }

// export default function useProjects() {
//   const [projects, setProjects] = useState<ProjectTab[]>([]);
//   const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

//   const addProject = (rootPath: string) => {
//     // 检查是否已存在
//     const existing = projects.find((p) => p.rootPath === rootPath);
//     if (existing) {
//       setActiveProjectId(existing.id);
//       return;
//     }

//     const name = rootPath.split("/").pop() || "项目";
//     const newProject: ProjectTab = {
//       id: uuidv4(),
//       name,
//       rootPath,

//     };

//     setProjects((prev) => [...prev, newProject]);
//     setActiveProjectId(newProject.id);
//   };

//   const closeProject = (projectId: string) => {
//     setProjects((prev) => prev.filter((p) => p.id !== projectId));
//     if (activeProjectId === projectId) {
//       const remaining = projects.filter((p) => p.id !== projectId);
//       setActiveProjectId(remaining.length ? remaining[0].id : null);
//     }
//   };

//   const getActiveProject = () => projects.find((p) => p.id === activeProjectId) || null;

//   return {
//     projects,
//     activeProjectId,
//     setActiveProjectId,
//     addProject,
//     closeProject,
//     getActiveProject,
//   };
// }

// hooks/useProjects.ts
import { useState } from "react";
import { ProjectTab, FileTab } from "@/types";
import { v4 as uuidv4 } from "uuid"; // 确保安装了uuid包

export default function useProjects() {
  const [projects, setProjects] = useState<ProjectTab[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const addProject = (folderPath: string) => {
    
    // 提取文件夹名称作为项目名
    const folderName = folderPath.split(/[/\\]/).pop() || "未命名项目";

    const newProject: ProjectTab = {
      id: uuidv4(), // 生成唯一ID
      name: folderName,
      path: folderPath,
      rootPath: folderPath, // 设置rootPath为项目根目录
      openFiles: [], // 初始无打开文件
      lastActiveFile: null // 初始无活动文件
    };

    setProjects(prev => [...prev, newProject]);

    // 激活新项目
    setActiveProjectId(newProject.id);

    // 立即请求加载新项目的文件结构
    window.electronAPI.send("open-folder", folderPath);

    return newProject.id;
  };

  const closeProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));

    // 如果关闭的是当前活动项目，切换到另一个项目
    if (activeProjectId === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      setActiveProjectId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const getActiveProject = () => {
    return projects.find(p => p.id === activeProjectId) || null;
  };

  // 更新项目的文件状态
  const updateProjectFiles = (projectId: string, openFiles: FileTab[], activeFile: string | null) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, openFiles, lastActiveFile: activeFile }
          : project
      )
    );
  };

  return {
    projects,
    activeProjectId,
    setActiveProjectId,
    addProject,
    closeProject,
    getActiveProject,
    updateProjectFiles
  };
}