import { FileTab, Folder, ProjectTab } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProjectsStore {
    projects: Record<string, ProjectTab>;
    activeProjectId: string | null;
    addProject: (folder: Folder) => string;
    updateProject: (projectId: string, updater: (p: ProjectTab) => Partial<ProjectTab>) => void;
    switchProject: (projectId: string) => void;
    closeProject: (projectId: string) => void;
    setActiveProjectId: (projectId: string | null) => void;
    getActiveProject: () => ProjectTab | null;

    createNewFileForProject: (projectId: string | null) => void;
    addOpenFileForProject: (projectId: string | undefined, file: FileTab) => void;
    changeFileContentForProject: (projectId: string | null, filePath: string, content: string) => void;
    setActiveFileForProject: (projectId: string | null, filepath: string | null) => void;
    closeFileForProject: (projectId: string | null, filePath: string) => void;

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
        }),
        {
            name: 'projects-store', // localStorage key
            partialize: (state) => ({
                projects: state.projects,
                activeProjectId: state.activeProjectId,
                orphanFiles: state.orphanFiles,
                activeOrphanFile: state.activeOrphanFile,
            }),
        }
    )
);