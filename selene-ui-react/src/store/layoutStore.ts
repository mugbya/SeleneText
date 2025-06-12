// // hooks/useLayoutStores.ts
// import { useProjectsStore } from "@/store/projectsStore";
// import { useFileTabsStore } from "@/store/fileTabsStore";
// import { usePanelsStore } from "@/store/panelsStore";
// import { useFileTreeStore } from "./fileTreeStore";

// export function useLayoutStores() {
//   // Projects 状态
//   const projects = useProjectsStore((s) => s.projects);
//   const activeProjectId = useProjectsStore((s) => s.activeProjectId);
//   const setActiveProjectId = useProjectsStore((s) => s.setActiveProjectId);
//   const getActiveProject = useProjectsStore((s) => s.getActiveProject);
//   const updateProjectFiles = useProjectsStore((s) => s.updateProjectFiles);
//   const addProject = useProjectsStore((s) => s.addProject);
//   const closeProject = useProjectsStore((s) => s.closeProject); // 如果你在用
//   const switchProject = useProjectsStore((s) => s.switchProject);

//   // FileTabs 状态
//   const openFiles = useFileTabsStore((s) => s.openFiles);
//   const activeFile = useFileTabsStore((s) => s.activeFile);
//   const setOpenFiles = useFileTabsStore((s) => s.setOpenFiles);
//   const setActiveFile = useFileTabsStore((s) => s.setActiveFile);
//   const addFile = useFileTabsStore((s) => s.addFile);
//   const closeFile = useFileTabsStore((s) => s.closeFile);
//   const changeFileContent = useFileTabsStore((s) => s.changeFileContent);

//   // Panels 状态
//   const showLeftPanel = usePanelsStore((s) => s.showLeftPanel);
//   const showRightPanel = usePanelsStore((s) => s.showRightPanel);
//   const rightMode = usePanelsStore((s) => s.rightMode);
//   const toggleLeftPanel = usePanelsStore((s) => s.toggleLeftPanel);
//   const toggleRightPanel = usePanelsStore((s) => s.toggleRightPanel);
//   const setShowRightPanel = usePanelsStore((s) => s.setShowRightPanel);
//   const setShowLeftPanel = usePanelsStore((s) => s.setShowLeftPanel);

//   // FileTreeState
//   const trees = useFileTreeStore((s) => s.trees);
//   const setTrees = useFileTreeStore((s) => s.setTrees);

//   return {
//     // Projects
//     projects,
//     activeProjectId,
//     setActiveProjectId,
//     getActiveProject,
//     updateProjectFiles,
//     addProject,
//     closeProject,
//     switchProject,

//     // FileTabs
//     openFiles,
//     activeFile,
//     setOpenFiles,
//     setActiveFile,
//     addFile,
//     closeFile,
//     changeFileContent,

//     // FileTree
//     trees,
//     setTrees,

//     // Panels
//     showLeftPanel,
//     showRightPanel,
//     rightMode,
//     toggleLeftPanel,
//     toggleRightPanel,
//     setShowRightPanel,
//     setShowLeftPanel,
    
//   };
// }