// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import type { MultiProjectStore, Project } from '@/types' // 假如类型放在 types.ts
//
// ;
//
// // 初始化项目
// function createProject(
//     data: Omit<Project, 'expandedKeys' | 'openFiles' | 'activeFile' | 'filesContent'>
// ): Project {
//     return {
//         ...data,
//         expandedKeys: [],
//         openFiles: [],
//         activeFile: null,
//         filesContent: {},
//     }
// }
//
// export const useMultiProjectStore = create<MultiProjectStore>()(
//     persist(
//         (set, get) => ({
//             projects: {},
//             activeProjectId: null,
//
//             getActiveProject: () => {
//                 const activeProjectId = get().activeProjectId
//                 // console.log("[useMultiProjectStore] getActiveProject: ", activeProjectId, ", project: ", get().projects);
//                 const activeProject = activeProjectId ? get().projects[activeProjectId] : null
//                 // console.log("[useMultiProjectStore - getActiveProject] activeProjectId: ", activeProjectId, ", project: ", activeProject);
//                 return activeProject
//             },
//
//             addProject: (projectData) =>
//                 set((state) => {
//                     // projects: {
//                     //     ...state.projects,
//                     //     [projectData.id]: createProject(projectData),
//                     // },
//                     const isFirst = Object.keys(state.projects).length === 0
//                     return {
//                       projects: {
//                         ...state.projects,
//                         [projectData.id]: createProject(projectData),
//                       },
//                       activeProjectId: isFirst ? projectData.id : state.activeProjectId,
//                     }
//                 }),
//
//             removeProject: (projectId) =>
//                 set((state) => {
//                     const newProjects = { ...state.projects }
//                     delete newProjects[projectId]
//                     const nextProjectId =
//                         state.activeProjectId === projectId
//                             ? Object.keys(newProjects)[0] || null
//                             : state.activeProjectId
//                     return { projects: newProjects, activeProjectId: nextProjectId }
//                 }),
//
//             setActiveProject: (projectId) =>
//                 set(() => ({ activeProjectId: projectId })),
//
//             updateProject: (projectId, updater) =>
//                 set((state) => ({
//                     projects: {
//                         ...state.projects,
//                         [projectId]: {
//                             ...state.projects[projectId],
//                             ...updater(state.projects[projectId]),
//                         },
//                     },
//                 })),
//
//             openFile: (projectId, filePath) =>
//                 set((state) => {
//                     const project = state.projects[projectId]
//                     if (!project) return {}
//                     const openFiles = project.openFiles.includes(filePath)
//                         ? project.openFiles
//                         : [...project.openFiles, filePath]
//                     return {
//                         projects: {
//                             ...state.projects,
//                             [projectId]: {
//                                 ...project,
//                                 openFiles,
//                                 activeFile: filePath,
//                             },
//                         },
//                     }
//                 }),
//
//             closeFile: (projectId, filePath) =>
//                 set((state) => {
//                     const project = state.projects[projectId]
//                     if (!project) return {}
//                     const openFiles = project.openFiles.filter((f) => f !== filePath)
//                     const activeFile =
//                         project.activeFile === filePath
//                             ? openFiles[openFiles.length - 1] || null
//                             : project.activeFile
//                     return {
//                         projects: {
//                             ...state.projects,
//                             [projectId]: {
//                                 ...project,
//                                 openFiles,
//                                 activeFile,
//                             },
//                         },
//                     }
//                 }),
//
//             setActiveFile: (projectId, filePath) =>
//                 set((state) => {
//                     const project = state.projects[projectId]
//                     if (!project) return {}
//                     if (!project.openFiles.includes(filePath)) return {}
//                     return {
//                         projects: {
//                             ...state.projects,
//                             [projectId]: {
//                                 ...project,
//                                 activeFile: filePath,
//                             },
//                         },
//                     }
//                 }),
//
//             setExpandedKeys: (projectId, expandedKeys) =>
//                 set((state) => ({
//                     projects: {
//                         ...state.projects,
//                         [projectId]: {
//                             ...state.projects[projectId],
//                             expandedKeys,
//                         },
//                     },
//                 })),
//
//             setFileContent: (projectId, filePath, content) =>
//                 set((state) => ({
//                     projects: {
//                         ...state.projects,
//                         [projectId]: {
//                             ...state.projects[projectId],
//                             filesContent: {
//                                 ...state.projects[projectId].filesContent,
//                                 [filePath]: content,
//                             },
//                         },
//                     },
//                 })),
//
//             removeFileContent: (projectId, filePath) =>
//                 set((state) => {
//                     const filesContent = { ...state.projects[projectId].filesContent }
//                     delete filesContent[filePath]
//                     return {
//                         projects: {
//                             ...state.projects,
//                             [projectId]: {
//                                 ...state.projects[projectId],
//                                 filesContent,
//                             },
//                         },
//                     }
//                 }),
//         }),
//         {
//             name: 'multi-project-state',
//             partialize: (state) => ({
//                 projects: state.projects,
//                 activeProjectId: state.activeProjectId,
//             }),
//         }
//     )
// )
//
// // localStorage.removeItem('multi-project-state');
// // localStorage.clear();