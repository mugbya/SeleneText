import Header from "./modules/Header";
import WorkSpaceTreePanel from "./modules/WorkSpaceTreePanel";
import MainContentTabs from "./modules/MainContentTabs";
import RightPanel from "./modules/RightPanel";
import Footer from "./modules/Footer";
import MenuPanel from "@/modules/MenuPanel";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import ProjectTabs from "./modules/ProjectTabs";
import { usePanelsStore } from "./store/panelsStore";
import { useFileTabsStore } from "./store/fileTabsStore";
import { useProjectsStore } from "./store/projectsStore";
import { useElectronEvents } from "./useElectronEvents";
import { useLayoutStores } from "./store/layoutStore";

export default function Layout() {
  
  useElectronEvents();
  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  const {
    projects,
    activeProjectId,
    setActiveProjectId,
    getActiveProject,
    // updateProjectFiles,
    // addProject,
    closeProject,
    switchProject,
    openFiles,
    activeFile,
    setOpenFiles,
    setActiveFile,
    addFile,
    closeFile,
    changeFileContent,
    // showLeftPanel,
    showRightPanel,
    // rightMode,
    toggleLeftPanel,
    toggleRightPanel,
    setShowRightPanel,
  } = useLayoutStores();
  
  // const {
  //   projects,
  //   activeProjectId,
  //   setActiveProjectId,
  //   getActiveProject,
  //   updateProjectFiles,
  //   addProject
  // } = useProjectsStore();

  // const {
  //   openFiles,
  //   activeFile,
  //   setOpenFiles,
  //   setActiveFile,
  //   addFile,
  //   closeFile,
  //   changeFileContent,
  // } = useFileTabsStore();

  // const {
  //   showLeftPanel,
  //   showRightPanel,
  //   rightMode,
  //   toggleLeftPanel,
  //   toggleRightPanel,
  //   setShowRightPanel,
  // } = usePanelsStore();

 
 

  const activeProject = getActiveProject();
  const rootPath = activeProject?.rootPath;

  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("\n[Layout] 执行渲染 count:", renderCount.current);

  // 只有多个项目时才显示标签页
  const shouldShowProjectTabs = projects.length > 1;
  // console.log("\n[Layout] 执行渲染....");
  console.log("[ProjectTabs] 当前项目数量：%s", projects.length);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header toggleLeft={toggleLeftPanel} toggleRight={toggleRightPanel} />

      {/* 项目标签栏 - 只在有多个项目时显示 */}
      {shouldShowProjectTabs && (
        <ProjectTabs
          projects={projects}
          activeProjectId={activeProjectId || ""}
          onSwitch={(newId) =>
            switchProject(
              newId,
              openFiles,
              activeFile,
              setOpenFiles,
              setActiveFile
            )} // 使用新的处理函数
          onClose={(id) => closeProject(id)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* 最左侧菜单栏 */}
        <MenuPanel
          openSettings={() => setShowRightPanel(true)}
          toggleLeft={toggleLeftPanel}
        />

        {/* {isSettingsMode && (
          <SettingsPage onClose={() => setShowRightPanel(false)} />
        )} */}

        {/* {!isSettingsMode && ( */}
        <PanelGroup direction="horizontal" className="flex-1">
          <Panel
            ref={leftPanelRef}
            minSize={10}
            defaultSize={20}
            collapsible
            onCollapse={() => usePanelsStore.getState().setShowLeftPanel(false)}
            onExpand={() => usePanelsStore.getState().setShowLeftPanel(true)}
            className="border border-zinc-300 rounded-md overflow-hidden"
          >
            {/* 工作区域 - 放目录树 - 避免空rootPath路径时渲染 WorkSpaceTreePanel 组件 */}
            {rootPath && (
            <WorkSpaceTreePanel
              selectedPath={activeFile}
              rootPath={rootPath}
              onFileSelect={(filePath) => {
                window.electronAPI
                  .readFile(filePath)
                  .then(({ success, content }) => {
                    setOpenFiles((prev) => {
                      const exists = prev.find((f) => f.path === filePath);
                      if (exists) return prev;
                      return [...prev, { path: filePath, content }];
                    });
                    // console.log("[Layout] 读取文件内容：%s", content);
                    setActiveFile(filePath);
                  });
              }}
            />
            )}
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
          {/* {showRightPanel && !isSettingsMode && ( */}
          {showRightPanel && (
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
        {/* )} */}
      </div>

      <Footer />
    </div>
  );
}
