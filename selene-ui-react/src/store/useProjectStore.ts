// import { Project } from '@/types'
// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// // 项目初始结构工厂
// function createProject({ id, name, fileTree }:Project) {
//   return {
//     id,
//     name,
//     fileTree,
//     expandedKeys: [],
//     openFiles: [],
//     activeFile: null,
//     filesContent: {}, // 文件内容缓存：{ [filePath]: content }
//   }
// }

// const useStore = create(
//   persist(
//     (set, get) => ({
//       projects: {}, // Map 结构，{ [id]: projectObj }
//       activeProjectId: null,

//       // 添加项目
//       addProject: (project: Project) =>
//         set((state) => ({
//           projects: {
//             ...state.projects,
//             [project.id]: createProject(project),
//           },
//         })),

//       // 删除项目
//       removeProject: (projectId: string) =>
//         set((state) => {
//           const newProjects = { ...state.projects }
//           delete newProjects[projectId]
//           // 自动切换活跃项目
//           const nextProjectId =
//             state.activeProjectId === projectId
//               ? Object.keys(newProjects)[0] || null
//               : state.activeProjectId
//           return { projects: newProjects, activeProjectId: nextProjectId }
//         }),

//       // 切换激活项目
//       setActiveProject: (projectId) =>
//         set(() => ({
//           activeProjectId: projectId,
//         })),

//       // 更新指定项目（传递一个 updater 函数）
//       updateProject: (projectId, updater) =>
//         set((state) => ({
//           projects: {
//             ...state.projects,
//             [projectId]: {
//               ...state.projects[projectId],
//               ...updater(state.projects[projectId]),
//             },
//           },
//         })),

//       // 打开文件
//       openFile: (projectId, filePath) =>
//         set((state) => {
//           const project = state.projects[projectId]
//           if (!project) return {}
//           const openFiles = project.openFiles.includes(filePath)
//             ? project.openFiles
//             : [...project.openFiles, filePath]
//           return {
//             projects: {
//               ...state.projects,
//               [projectId]: {
//                 ...project,
//                 openFiles,
//                 activeFile: filePath,
//               },
//             },
//           }
//         }),

//       // 关闭文件
//       closeFile: (projectId, filePath) =>
//         set((state) => {
//           const project = state.projects[projectId]
//           if (!project) return {}
//           const openFiles = project.openFiles.filter((f) => f !== filePath)
//           const activeFile =
//             project.activeFile === filePath
//               ? openFiles[openFiles.length - 1] || null
//               : project.activeFile
//           return {
//             projects: {
//               ...state.projects,
//               [projectId]: {
//                 ...project,
//                 openFiles,
//                 activeFile,
//               },
//             },
//           }
//         }),

//       // 切换激活文件
//       setActiveFile: (projectId, filePath) =>
//         set((state) => {
//           const project = state.projects[projectId]
//           if (!project) return {}
//           if (!project.openFiles.includes(filePath)) return {}
//           return {
//             projects: {
//               ...state.projects,
//               [projectId]: {
//                 ...project,
//                 activeFile: filePath,
//               },
//             },
//           }
//         }),

//       // 设置展开节点
//       setExpandedKeys: (projectId, expandedKeys) =>
//         set((state) => ({
//           projects: {
//             ...state.projects,
//             [projectId]: {
//               ...state.projects[projectId],
//               expandedKeys,
//             },
//           },
//         })),

//       // 文件内容缓存相关
//       setFileContent: (projectId, filePath, content) =>
//         set((state) => ({
//           projects: {
//             ...state.projects,
//             [projectId]: {
//               ...state.projects[projectId],
//               filesContent: {
//                 ...state.projects[projectId].filesContent,
//                 [filePath]: content,
//               },
//             },
//           },
//         })),
//       removeFileContent: (projectId, filePath) =>
//         set((state) => {
//           const filesContent = { ...state.projects[projectId].filesContent }
//           delete filesContent[filePath]
//           return {
//             projects: {
//               ...state.projects,
//               [projectId]: {
//                 ...state.projects[projectId],
//                 filesContent,
//               },
//             },
//           }
//         }),
//     }),
//     {
//       name: 'multi-project-state', // localStorage key
//       partialize: (state) => ({
//         projects: state.projects,
//         activeProjectId: state.activeProjectId,
//       }),
//     }
//   )
// )

// export default useStore