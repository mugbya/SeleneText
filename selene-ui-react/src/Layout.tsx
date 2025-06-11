import React from "react";
import Header from "./modules/Header";
import WorkSpaceTreePanel from "./modules/WorkSpaceTreePanel";
import MainContentTabs from "./modules/MainContentTabs";
import RightPanel from "./modules/RightPanel";
import Footer from "./modules/Footer";
import MenuPanel from "@/modules/MenuPanel";
import SettingsPage from "@/modules/SettingsPage";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

import useFileTabs from "@/hooks/useFileTabs";
import { useFileSaveListener } from "@/hooks/useFileSaveListener";
import { usePanels } from "@/hooks/usePanels";
import ProjectTabs from "./modules/ProjectTabs";
import useProjects from "./hooks/useProjects";


export default function Layout() {

  // const {
  //   projects,
  //   activeProjectId,
  //   setActiveProjectId,
  //   addProject,
  //   closeProject,
  //   getActiveProject,
  // } = useProjects();

  // const {
  //   openFiles,
  //   activeFile,
  //   setActiveFile,
  //   addFile,
  //   closeFile,
  //   changeFileContent,
  //   setOpenFiles,
  // } = useFileTabs(activeProjectId);

  // const {
  //   showLeftPanel,
  //   showRightPanel,
  //   rightMode,
  //   leftPanelRef,
  //   setShowLeftPanel,
  //   setShowRightPanel,
  //   setRightMode,
  //   toggleLeft,
  //   toggleRight,
  // } = usePanels();

 

  // useFileSaveListener(openFiles, activeFile, setOpenFiles, setActiveFile, addProject);

  // const isSettingsMode = rightMode === "settings";

  // return (
  //   <div className="flex flex-col h-screen bg-background text-foreground">
  //     <Header toggleLeft={toggleLeft} toggleRight={toggleRight} />

  //     {/* 项目标签栏 */}
  //     <ProjectTabs
  //       projects={projects}
  //       activeProjectId={activeProjectId ?? ""}
  //       onSwitch={setActiveProjectId}
  //       onClose={closeProject}
  //     />

  //     <div className="flex flex-1 overflow-hidden">
  //       {/* 最左侧菜单栏 */}
  //       <MenuPanel openSettings={() => setShowRightPanel(true)} toggleLeft={toggleLeft} />

  //       {/* {isSettingsMode && <SettingsPage onClose={() => setShowRightPanel(false)} />} */}

  //       {!isSettingsMode && (
  //         <PanelGroup direction="horizontal" className="flex-1">
  //           <Panel
  //             ref={leftPanelRef}
  //             minSize={10}
  //             defaultSize={20}
  //             collapsible
  //             onCollapse={() => setShowLeftPanel(false)}
  //             onExpand={() => setShowLeftPanel(true)}
  //             className="border border-zinc-300 rounded-md overflow-hidden"
  //           >
  //             {/* 工作区域 - 放目录树 */}
  //             <WorkSpaceTreePanel
  //               selectedPath={activeFile}
  //               onFileSelect={(filePath) => {
  //                 window.electronAPI.readFile(filePath).then((content: string) => {
  //                   setOpenFiles((prev) => {
  //                     const exists = prev.find((f) => f.path === filePath);
  //                     if (exists) return prev;
  //                     return [...prev, { path: filePath, content }];
  //                   });
  //                   setActiveFile(filePath);
  //                 });
  //               }}
  //             />
  //           </Panel>

  //           <PanelResizeHandle className="w-1 cursor-col-resize" />

  //           {/* 工作区域 - 放文件内容 */}
  //           <Panel minSize={30}>
  //             <MainContentTabs
  //               openFiles={openFiles}
  //               activeFile={activeFile}
  //               onSwitchFile={setActiveFile}
  //               onCloseFile={closeFile}
  //               onAddFile={addFile}
  //               onChangeFileContent={changeFileContent}
  //             />
  //           </Panel>

  //           {/* 右侧面板 */}
  //           {showRightPanel && !isSettingsMode && (
  //             <>
  //               <PanelResizeHandle className="w-1 cursor-col-resize" />
  //               <Panel
  //                 className="border border-zinc-300 rounded-md overflow-hidden overflow-y-auto"
  //                 minSize={10}
  //                 defaultSize={25}
  //                 collapsible
  //                 onCollapse={() => setShowRightPanel(false)}
  //                 onExpand={() => setShowRightPanel(true)}
  //               >
  //                 <RightPanel />
  //               </Panel>
  //             </>
  //           )}
  //         </PanelGroup>
  //       )}
  //     </div>

  //     <Footer />
  //   </div>
  // );

  const {
    openFiles,
    activeFile,
    setActiveFile,
    addFile,
    closeFile,
    changeFileContent,
    setOpenFiles,
  } = useFileTabs();

  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    addProject,
    closeProject,
    getActiveProject,
    updateProjectFiles
  } = useProjects();

  const {
    showLeftPanel,
    showRightPanel,
    rightMode,
    leftPanelRef,
    setShowLeftPanel,
    setShowRightPanel,
    setRightMode,
    toggleLeft,
    toggleRight,
  } = usePanels();

  // 处理项目切换
  const handleProjectSwitch = (newProjectId: string) => {
    console.log("切换项目到: %s,  激活状态：%s", newProjectId, activeProjectId);
    // 保存当前项目的状态
    if (activeProjectId) {
      updateProjectFiles(activeProjectId, openFiles, activeFile);
    }
    
    // 切换到新项目
    setActiveProjectId(newProjectId);
    
    // 加载新项目的状态
    const newProject = projects.find(p => p.id === newProjectId);
    if (newProject) {
      setOpenFiles(newProject.openFiles || []);
      setActiveFile(newProject.lastActiveFile ?? "");
      
      // 如果项目有特定的工作区路径，可以这里加载
      // 例如更新工作区目录树等

      // 如果项目有特定的工作区路径，这里会触发 WorkSpaceTreePanel 的更新
      console.log("Switching to project with rootPath:", newProject.rootPath);
    }
  };

  useFileSaveListener(
    openFiles, 
    activeFile, 
    setOpenFiles, 
    setActiveFile, 
    addProject,
    activeProjectId,
    setActiveProjectId,
    updateProjectFiles,
    getActiveProject
  );

  const isSettingsMode = rightMode === "settings";

  // 只有多个项目时才显示标签页
  const shouldShowProjectTabs = projects.length > 1;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header toggleLeft={toggleLeft} toggleRight={toggleRight} />

      {/* 项目标签栏 */}
      {/* <ProjectTabs
        projects={projects}
        activeProjectId={activeProjectId ?? ""}
        onSwitch={setActiveProjectId}
        onClose={closeProject}
      /> */}

{/* 项目标签栏 - 只在有多个项目时显示 */}
{shouldShowProjectTabs && (
      <ProjectTabs
        projects={projects}
        activeProjectId={activeProjectId || ""}
        onSwitch={handleProjectSwitch}  // 使用新的处理函数
        onClose={closeProject}
      />
)}

      <div className="flex flex-1 overflow-hidden">
        {/* 最左侧菜单栏 */}
        <MenuPanel openSettings={() => setShowRightPanel(true)} toggleLeft={toggleLeft} />

        {isSettingsMode && <SettingsPage onClose={() => setShowRightPanel(false)} />}

        {!isSettingsMode && (
          <PanelGroup direction="horizontal" className="flex-1">
            <Panel
              ref={leftPanelRef}
              minSize={10}
              defaultSize={20}
              collapsible
              onCollapse={() => setShowLeftPanel(false)}
              onExpand={() => setShowLeftPanel(true)}
              className="border border-zinc-300 rounded-md overflow-hidden"
            >
              {/* 工作区域 - 放目录树 */}
              {/* <WorkSpaceTreePanel
                selectedPath={activeFile}
                onFileSelect={(filePath) => {
                  window.electronAPI.readFile(filePath).then((content: string) => {
                    setOpenFiles((prev) => {
                      const exists = prev.find((f) => f.path === filePath);
                      if (exists) return prev;
                      return [...prev, { path: filePath, content }];
                    });
                    setActiveFile(filePath);
                  });
                }}
              /> */}
              <WorkSpaceTreePanel
                selectedPath={activeFile}
                rootPath={getActiveProject()?.rootPath}
                onFileSelect={(filePath) => {
                  window.electronAPI.readFile(filePath).then((content: string) => {
                    setOpenFiles((prev) => {
                      const exists = prev.find((f) => f.path === filePath);
                      if (exists) return prev;
                      return [...prev, { path: filePath, content }];
                    });
                    setActiveFile(filePath);
                  });
                }}
              />

            </Panel>

            <PanelResizeHandle className="w-1 cursor-col-resize" />

            {/* 工作区域 - 放文件内容 */}
            <Panel minSize={30}>
              <MainContentTabs
                openFiles={openFiles}
                activeFile={activeFile}
                onSwitchFile={setActiveFile}
                onCloseFile={closeFile}
                onAddFile={addFile}
                onChangeFileContent={changeFileContent}
              />
            </Panel>

            {/* 右侧面板 */}
            {showRightPanel && !isSettingsMode && (
              <>
                <PanelResizeHandle className="w-1 cursor-col-resize" />
                <Panel
                  className="border border-zinc-300 rounded-md overflow-hidden overflow-y-auto"
                  minSize={10}
                  defaultSize={25}
                  collapsible
                  onCollapse={() => setShowRightPanel(false)}
                  onExpand={() => setShowRightPanel(true)}
                >
                  <RightPanel />
                </Panel>
              </>
            )}
          </PanelGroup>
        )}
      </div>

      <Footer />
    </div>
  );
}
