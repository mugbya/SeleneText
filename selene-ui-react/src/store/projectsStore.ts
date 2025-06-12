import { FileTab, ProjectTab } from '@/types';
import { create } from 'zustand';

interface ProjectsStore {
  projects: ProjectTab[];
  activeProjectId: string | null;
  addProject: (folderPath: string) => string;
  closeProject: (id: string) => void;
  setActiveProjectId: (id: string | null) => void;
  updateProjectFiles: (id: string, files: FileTab[], active: string | null) => void;
  getActiveProject: () => ProjectTab | null;
  // 👇 新增
  switchProject: (
    newId: string,
    currentOpenFiles: FileTab[],
    currentActiveFile: string | null,
    setOpenFiles: (tabs: FileTab[]) => void,
    setActiveFile: (path: string | null) => void
  ) => void;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  activeProjectId: null,


  addProject: (folderPath) => {
    const folderName = folderPath.split(/[/\\]/).pop() || '未命名项目';
    const newProject: ProjectTab = {
      id: crypto.randomUUID(),
      name: folderName,
      path: folderPath,
      rootPath: folderPath,
      openFiles: [],
      lastActiveFile: null
    };
    set((state) => ({
      projects: [...state.projects, newProject],
      activeProjectId: newProject.id,
    }));
    window.electronAPI.send("open-folder", folderPath);
    return newProject.id;
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
    })),

  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find(p => p.id === activeProjectId) || null;
  },
  
  // ✅ 实现 switchProject 方法
  switchProject: (newId, currentOpenFiles, currentActiveFile, setOpenFiles, setActiveFile) => {
    const { activeProjectId, updateProjectFiles, setActiveProjectId, projects } = get();

    // 1. 保存当前项目的打开文件信息
    if (activeProjectId) {
      updateProjectFiles(activeProjectId, currentOpenFiles, currentActiveFile);
    }

    // 2. 切换项目
    setActiveProjectId(newId);

    // 3. 恢复新项目状态
    const newProject = projects.find((p) => p.id === newId);
    if (newProject) {
      setOpenFiles(newProject.openFiles || []);
      setActiveFile(newProject.lastActiveFile ?? null);
    }
  }

}));