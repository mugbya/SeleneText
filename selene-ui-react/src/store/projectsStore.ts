import { FileNode, FileTab, Folder, ProjectTab } from '@/types';
import { create } from 'zustand';

// addProject: (project: Omit<ProjectTab, 'expandedKeys' | 'openFiles' | 'lastActiveFile' | 'filesContent'>) => string;
// projects: ProjectTab[];
// getProjects: () => ProjectTab[];
// setOpenFilesWithContent: (
//   // projectId: string,
//   files: { path: string; content: string }[],
//   activeFile?: string
// ) => void;
// setOpenFiles: (tabs: FileTab[]) => void;
// setOpenFiles: (tabs: FileTab[]) => void;        // 设置项目 下的打开文件列表
// updateProjectFiles: (projectId: string, files: FileTab[], active: string | null) => void; //  更新项目下的打开文件列表
 // setOpenFiles: (tabs: FileTab[]) => void;        // 设置项目 下的打开文件列表

interface ProjectsStore {
  projects: Record<string, ProjectTab>; // 项目字典
  activeProjectId: string | null; // 激活的项目 id
  addProject: (folder: Folder) => string;   // 新增项目
  /**
     * 更新项目（如文件树、展开状态、标签页等）
     * @param projectId 
     * @param updater 
     * @returns 
     */
  updateProject: (projectId: string, updater: (p: ProjectTab) => Partial<ProjectTab>) => void;
  switchProject: (projectId: string) => void; // 切换项目
  closeProject: (projectId: string) => void; // 关闭项目
  setActiveProjectId: (projectId: string | null) => void; // 设置激活的项目 id
  getActiveProject: () => ProjectTab | null; // 获取激活的项目

  addOpenFileForProject: (projectId: string | undefined, file: FileTab) => void; // 项目 新增打开的文件
  changeFileContentForProject: (projectId: string | null, filePath: string, content: string) => void; // 更新项目 下的文件内容
  setActiveFileForProject: (projectId: string | null, filepath: string | null) => void; // 设置项目 下的激活文件
  closeFileForProject: (projectId: string, filePath: string) => void; // 关闭项目 下的文件
}


export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: {},
  activeProjectId: null,

  // 添加新项目
  addProject: (folder: Folder) => {
    // const id = nanoid();
    const id = crypto.randomUUID();
    const name = folder.basePath.split('/').pop() || 'Project';
    const newProject: ProjectTab = {
      id,
      name,
      rootPath: folder.basePath,
      folderTree: {
        name,
        path: folder.basePath,
        isDirectory: true,
        children: folder.contents,
      },
      openFiles: [],
      lastActiveFile: null,
      expandedKeys: [],
    };

    set((state) => ({
      projects: {
        ...state.projects,
        [id]: newProject,
      },
      activeProjectId: id,
    }));

    return id;
  },

  // 更新项目（partial update）
  updateProject: (projectId, updater) => {
    set((state) => {
      const project = state.projects[projectId];
      if (!project) return {};

      const updated = updater(project);
      return {
        projects: {
          ...state.projects,
          [projectId]: {
            ...project,
            ...updated,
          },
        },
      };
    });
  },

  // 切换激活项目
  switchProject: (projectId) => {
    set(() => ({ activeProjectId: projectId }));
  },

  // 设置激活项目 ID
  setActiveProjectId: (projectId) => {
    set(() => ({ activeProjectId: projectId }));
  },

  // 获取当前激活项目
  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return activeProjectId ? projects[activeProjectId] : null;
  },

  // 关闭项目
  closeProject: (projectId) => {
    set((state) => {
      const newProjects = { ...state.projects };
      delete newProjects[projectId];
      const newActiveId =
        state.activeProjectId === projectId
          ? Object.keys(newProjects)[0] || null
          : state.activeProjectId;
      return {
        projects: newProjects,
        activeProjectId: newActiveId,
      };
    });
  },

  // 添加打开文件
  addOpenFileForProject: (projectId, file) => {
    if (!projectId) return;
    set((state) => {
      const project = state.projects[projectId];
      if (!project) return {};

      const exists = project.openFiles.some((f) => f.path === file.path);
      const newOpenFiles = exists ? project.openFiles : [...project.openFiles, file];

      return {
        projects: {
          ...state.projects,
          [projectId]: {
            ...project,
            openFiles: newOpenFiles,
            lastActiveFile: file.path,
          },
        },
      };
    });
  },

  // 设置当前激活文件
  setActiveFileForProject: (projectId, filepath) => {
    set((state) => {
      if (!projectId) return {};

      const project = state.projects[projectId];
      if (!project) return {};
      return {
        projects: {
          ...state.projects,
          [projectId]: {
            ...project,
            lastActiveFile: filepath,
          },
        },
      };
    });
  },

  // 修改文件内容
  changeFileContentForProject: (projectId, filePath, content) => {
    set((state) => {

      if (!projectId) return {};

      const project = state.projects[projectId];
      if (!project) return {};

      const updatedFiles = project.openFiles.map((f) =>
        f.path === filePath ? { ...f, content } : f
      );

      return {
        projects: {
          ...state.projects,
          [projectId]: {
            ...project,
            openFiles: updatedFiles,
          },
        },
      };
    });
  },

  // 关闭文件
  closeFileForProject: (projectId, filePath) => {
    set((state) => {
      const project = state.projects[projectId];
      if (!project) return {};

      const updatedFiles = project.openFiles.filter((f) => f.path !== filePath);
      const isClosedActive = project.lastActiveFile === filePath;
      const newActive = isClosedActive ? (updatedFiles.at(-1)?.path ?? null) : project.lastActiveFile;

      return {
        projects: {
          ...state.projects,
          [projectId]: {
            ...project,
            openFiles: updatedFiles,
            lastActiveFile: newActive,
          },
        },
      };
    });
  },
}));


