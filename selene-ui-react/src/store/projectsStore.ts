import { FileNode, FileTab, Folder, ProjectTab } from '@/types';
import { create } from 'zustand';

interface ProjectsStore {
  projects: ProjectTab[];
  activeProjectId: string | null;
  addProject: (folder: Folder) => string;
  closeProject: (id: string) => void;
  setActiveProjectId: (id: string | null) => void;
  updateProjectFiles: (id: string, files: FileTab[], active: string | null) => void;
  getActiveProject: () => ProjectTab | null;
  getProjects: () => ProjectTab[];

  // setOpenFiles: (tabs: FileTab[]) => void;
  setOpenFiles: (currentOpenFile: FileTab) => void;        // 设置项目 下的打开文件列表
  closeFileForProject: (id: string, path: string) => void; // 关闭项目 下的文件
  setActiveFileForProject: (id: string | null, path: string | null) => void; // 设置项目 下的激活文件

  // 👇 新增
  switchProject: (
    newId: string,
    // currentOpenFiles: FileTab[],
    // currentActiveFile: string | null,
    // setFolderTree: (folderTree: FileNode[]) => void,
    // setOpenFiles: (tabs: FileTab[]) => void,
    // setActiveFile: (path: string | null) => void
  ) => void;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  activeProjectId: null,

  setActiveFileForProject: (id, path) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id? {...p, lastActiveFile: path } : p
      ),
    }));
  },

  closeFileForProject: (id, path) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id? {
          ...p,
          openFiles: p.openFiles.filter((f) => f.path !== path),
          lastActiveFile: p.lastActiveFile === path? null : p.lastActiveFile,
        } : p
      ),
    }))
  },

  setOpenFiles: (currentOpenFile) => {
    const { activeProjectId, updateProjectFiles, getActiveProject } = get();
    if (activeProjectId) {
      const activeProject = getActiveProject();
      const openFiles = activeProject?.openFiles || [];

      // 避免重复添加同一个文件
      // const alreadyOpen = openFiles.find((f) => f.path === currentOpenFile.path);
      const alreadyOpen = openFiles.some((f) => f.path === currentOpenFile.path);
      console.log("[useProjectsStore] setOpenFiles alreadyOpen: %o, openFiles: %o, currentOpenFile.path: %s", alreadyOpen, openFiles, currentOpenFile.path);
      if (!alreadyOpen) {
        const updatedOpenFiles = [...openFiles, currentOpenFile];
        updateProjectFiles(activeProjectId, updatedOpenFiles, currentOpenFile.path);
      }
    }
  },

  addProject: (folder) => {
    const folderName = folder.basePath.split(/[/\\]/).pop() || '未命名项目';
    const newProject: ProjectTab = {
      id: crypto.randomUUID(),
      name: folderName,
      // path: folderPath,
      rootPath: folder.basePath,
      openFiles: [],
      folderTree: folder.contents,
      lastActiveFile: null
    };
    set((state) => ({
      projects: [...state.projects, newProject],
      activeProjectId: newProject.id,
    }));
    const { projects } = get();
    console.log("addProject 后的 projects: %o", projects);
    // window.electronAPI.send("open-folder", folderPath);
    return newProject.id;
  },

  getProjects: () => {
    const { projects } = get();
    return projects;
  },

  closeProject: (id) => {
    const { projects, activeProjectId } = get();
    const remaining = projects.filter(p => p.id !== id);
    set({ projects: remaining });
    if (activeProjectId === id) {
      set({ activeProjectId: remaining.length ? remaining[0].id : null });
    }
  },

  setActiveProjectId: (id) => set({ activeProjectId: id }),

  updateProjectFiles: (id, openFiles, activeFile) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, openFiles, lastActiveFile: activeFile } : p
      ),
    })
  ),

  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find(p => p.id === activeProjectId) || null;
  },

  // ✅ 实现 switchProject 方法
  // switchProject: (newId, currentOpenFiles, currentActiveFile, setFolderTree, setOpenFiles, setActiveFile) => {
  // switchProject: (newId, currentOpenFiles, currentActiveFile, setOpenFiles, setActiveFile) => {
  switchProject: (newId) => {

    const { activeProjectId, updateProjectFiles, setActiveProjectId, projects } = get();

    // 1. 保存当前项目的打开文件信息
    // if (activeProjectId) {
    //   updateProjectFiles(activeProjectId, currentOpenFiles, currentActiveFile);
    // }

    // 2. 切换项目
    setActiveProjectId(newId);

    // 3. 恢复新项目状态
    const newProject = projects.find((p) => p.id === newId);
    if (newProject) {
      // setFolderTree(newProject.folderTree || []);
      // setOpenFiles(newProject.openFiles || []);
      // setActiveFile(newProject.lastActiveFile ?? null);
    }
  },



}));