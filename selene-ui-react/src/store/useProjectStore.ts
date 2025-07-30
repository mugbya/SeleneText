import { FileTab, Folder, ProjectTab } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProjectsStore {
    /**
     * 项目字典
     */
    projects: Record<string, ProjectTab>;

    /**
     * 当前激活的项目ID
     */
    activeProjectId: string | null;

    /**
     * 目录的是否展开: key 是绝对路径
     */
    expandedDirs: Record<string, boolean>;

    addProject: (folder: Folder) => string;
    updateProject: (projectId: string, updater: (p: ProjectTab) => Partial<ProjectTab>) => void;
    switchProject: (projectId: string) => void;
    closeProject: (projectId: string | null) => void;
    closeProjectByPath: (rootPath: string | null) => void;
    setActiveProjectId: (projectId: string | null) => void;
    getActiveProject: () => ProjectTab | null;

    createNewFileForProject: (projectId: string | null) => void;
    addOpenFileForProject: (projectId: string | undefined, file: FileTab) => void;
    changeFileContentForProject: (projectId: string | null, filePath: string, content: string) => void;
    setActiveFileForProject: (projectId: string | null, filepath: string | null) => void;
    closeFileForProject: (projectId: string | null, filePath: string) => void;

    // 目录树的展开收起
    toggleExpanded: (path: string) => void;
    setExpanded: (path: string, expanded: boolean) => void;
    resetExpanded: () => void;

    // markdown文件处理
    setFileModeForProject: (projectId: string | null, filePath: string, mode: 'source' | 'wysiwyg') => void;
    setMarkdownForFile: (projectId: string | null, filePath: string, markdown: string) => void;

    /**
     * 临时文件列表
     */
    orphanFiles: FileTab[];
    activeOrphanFile: string | null;
    createOrphanFile: () => void;
    removeOrphanFile: (filePath: string) => void;
    changeOrphanFileContent: (filePath: string, content: string) => void;
}

export const useProjectsStore = create<ProjectsStore>()(
    persist(
        (set, get) => ({
            projects: {},
            activeProjectId: null,
            expandedDirs: {},
            orphanFiles: [],
            activeOrphanFile: null,

            addProject: (folder: Folder) => {
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

            switchProject: (projectId) => {
                set(() => ({ activeProjectId: projectId }));
            },

            setActiveProjectId: (projectId) => {
                set(() => ({ activeProjectId: projectId }));
            },

            getActiveProject: () => {
                const { projects, activeProjectId } = get();
                return activeProjectId ? projects[activeProjectId] : null;
            },

            closeProjectByPath:(rootPath) => {
                set((state) => {
                    const projectId = Object.keys(state.projects).find((id) => state.projects[id].rootPath === rootPath);
                    if (!projectId) return {};
                    const newProjects = {...state.projects };
                    delete newProjects[projectId];
                    const newActiveId =
                        state.activeProjectId === projectId
                           ? Object.keys(newProjects)[0] || null
                            : state.activeProjectId;
                    return {
                        projects: newProjects,
                        activeProjectId: newActiveId,
                    }
                })
            },
            
            closeProject: (projectId) => {
                set((state) => {
                    if (!projectId) return {};

                    const project = state.projects[projectId];
                    if (!project) return {};

                    const newProjects = { ...state.projects };
                    delete newProjects[projectId];

                    // 清理 expandedDirs 中属于该项目的目录
                    const newExpandedDirs: Record<string, boolean> = {};
                    for (const key in state.expandedDirs) {
                        if (!key.startsWith(project.rootPath)) {
                            newExpandedDirs[key] = state.expandedDirs[key];
                        }
                    }

                    const newActiveId =
                        state.activeProjectId === projectId
                            ? Object.keys(newProjects)[0] || null
                            : state.activeProjectId;
                    return {
                        projects: newProjects,
                        activeProjectId: newActiveId,
                        expandedDirs: newExpandedDirs,
                    };
                });
            },

            createNewFileForProject: (projectId) => {
                if (!projectId) return;
                set((state) => {
                    const project = state.projects[projectId];
                    if (!project) return {};

                    const newFilePath = `untitled-${Date.now()}.txt`;
                    const newFile: FileTab = {
                        path: newFilePath,
                        content: "",
                        isTemporary: true
                    };

                    return {
                        projects: {
                            ...state.projects,
                            [projectId]: {
                                ...project,
                                openFiles: [...project.openFiles, newFile],
                                lastActiveFile: newFilePath,
                            },
                        },
                    };
                });
            },

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

            toggleExpanded: (path) => {
                set((state) => {
                    const isExpanded = state.expandedDirs[path];
                    return {
                        expandedDirs: {
                            ...state.expandedDirs,
                            [path]: !isExpanded,
                        },
                    };
                });
            },

            setExpanded: (path, expanded) => {
                set((state) => {
                    const updated = { ...state.expandedDirs };
                    if (expanded) {
                        updated[path] = true;
                    } else {
                        delete updated[path];
                    }
                    return { expandedDirs: updated };
                });
            },

            resetExpanded: () => set({ expandedDirs: {} }),

            closeFileForProject: (projectId, filePath) => {
                set((state) => {
                    if (!projectId) {
                        const newOrphanFiles = state.orphanFiles.filter((f) => f.path !== filePath);
                        const isClosedActive = state.activeOrphanFile === filePath;
                        const newActive = isClosedActive ? (newOrphanFiles.at(-1)?.path ?? null) : state.activeOrphanFile;
                        return {
                            orphanFiles: newOrphanFiles,
                            activeOrphanFile: newActive,
                        };
                    }

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

            createOrphanFile: () => {
                set((state) => {
                    const newPath = `untitled-${Date.now()}.txt`;
                    const newFile: FileTab = {
                        path: newPath,
                        content: "",
                        isTemporary: true,
                    };
                    return {
                        orphanFiles: [...state.orphanFiles, newFile],
                        activeOrphanFile: newPath,
                    };
                });
            },

            removeOrphanFile: (filePath) => {
                set((state) => ({
                    orphanFiles: state.orphanFiles.filter((f) => f.path !== filePath),
                    activeOrphanFile:
                        state.activeOrphanFile === filePath ? null : state.activeOrphanFile,
                }));
            },

            changeOrphanFileContent: (filePath, content) =>
                set((state) => ({
                    orphanFiles: state.orphanFiles.map((f) =>
                        f.path === filePath ? { ...f, content } : f
                    ),
                })),
                
            setFileModeForProject: (projectId, filePath, mode) => {
                set((state) => {
                    if (!projectId) return {};

                    const project = state.projects[projectId];
                    if (!project) return {};

                    const updatedFiles = project.openFiles.map((f) =>
                        f.path === filePath ? { ...f, mode } : f
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

            setMarkdownForFile: (projectId, filePath, markdown) => {
                set((state) => {
                    if (!projectId) return {};

                    const project = state.projects[projectId];
                    if (!project) return {};

                    const updatedFiles = project.openFiles.map((f) =>
                        f.path === filePath ? { ...f, markdown } : f
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
        }),
        {
            name: 'projects-store', // localStorage key
            partialize: (state) => ({
                projects: state.projects,
                activeProjectId: state.activeProjectId,
                orphanFiles: state.orphanFiles,
                activeOrphanFile: state.activeOrphanFile,
                expandedDirs: state.expandedDirs, // ✅ 加上这个
            }),
        }
    )
);

// 初始化时读取
export async function initProjectsStoreFromElectronStore() {
    if (window.electronAPI) {
        const data = await window.electronAPI.getProjectsStore()
        if (data) {
            useProjectsStore.setState(data)
        }
    }
}


// 👇 持久化到 electron-store 的同步监听器
if (typeof window !== 'undefined' && window.electronAPI) {
    useProjectsStore.subscribe((state) => {

        // 清理 expandedDirs 中不属于任何项目的目录
        const newExpandedDirs: Record<string, boolean> = {};
        for (const key in state.expandedDirs) {
            const project = Object.values(state.projects).find((p) => key.startsWith(p.rootPath));
            if (project) {
                newExpandedDirs[key] = state.expandedDirs[key];
            }
        }

        const persistData = {
            projects: state.projects,
            activeProjectId: state.activeProjectId,
            // expandedDirs: state.expandedDirs,
            expandedDirs: newExpandedDirs,
            orphanFiles: state.orphanFiles,
            activeOrphanFile: state.activeOrphanFile,
        };
        window.electronAPI.setProjectsStore(persistData);
    });
}