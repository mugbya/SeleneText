import Header from "./modules/Header";
import WorkSpaceTreePanel from "./modules/WorkSpaceTreePanel";
import MainContentTabs from "./modules/MainContentTabs";
import RightPanel from "./modules/RightPanel";
import Footer from "./modules/Footer";
import MenuPanel from "./modules/MenuPanel";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import ProjectTabs from "./modules/ProjectTabs";
import { useElectronEvents } from "./useElectronEvents";
import { usePanelsStore } from "./store/panelsStore";
import { toast, Toaster } from "sonner";
import { useProjectsStore } from "./store/useProjectStore";
import React from "react";
import { smartToast } from "./utils/commonUtil";

export default function Layout() {
  useElectronEvents();
  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  // Projects 状态
  const projects = useProjectsStore((s) => s.projects);
  const activeProjectId = useProjectsStore((s) => s.activeProjectId);
  const getActiveProject = useProjectsStore((s) => s.getActiveProject);
  const closeProject = useProjectsStore((s) => s.closeProject); // 如果你在用
  const switchProject = useProjectsStore((s) => s.switchProject);

  // Panels 状态
  const showLeftPanel = usePanelsStore((s) => s.showLeftPanel);
  const showRightPanel = usePanelsStore((s) => s.showRightPanel);
  //  const rightMode = usePanelsStore((s) => s.rightMode);
  const toggleLeftPanel = usePanelsStore((s) => s.toggleLeftPanel);
  const toggleRightPanel = usePanelsStore((s) => s.toggleRightPanel);
  const setShowRightPanel = usePanelsStore((s) => s.setShowRightPanel);
  const setShowLeftPanel = usePanelsStore((s) => s.setShowLeftPanel);

  const activeProject = getActiveProject();

  const projectId = activeProject?.id;
  const projectRootPath = activeProject?.rootPath;

  const projectOpenFiles = activeProject?.openFiles;
  const projectActiveFilePath = activeProject?.lastActiveFile;

  const folderTree = activeProject?.folderTree;

  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("\n[Layout] 执行渲染 count:", renderCount.current);

  const projectsLength = Object.values(projects).length;
  // 只有多个项目时才显示标签页
  const shouldShowProjectTabs = projectsLength > 1;

  console.log(
    "[Layout] 当前项目数量：%s, rootPath: %s",
    projectsLength,
    projectRootPath
  );
  console.log("[Layout] projectActiveFilePath: %o", projectActiveFilePath);
  console.log("[Layout] projectOpenFiles: %o", projectOpenFiles);
  
  // smartToast('项目目录已被删除：/Users/mugbya/Desktop/测试删除', 'info');
  // toast.info(<div className="">项目目录已被删除：/Users/mugbya/Desktop/测试删除</div>, { dismissible: true, closeButton: true })
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground ">
      <Header toggleLeft={toggleLeftPanel} toggleRight={toggleRightPanel} />

      {/* 消息提示 */}
      <Toaster
        position="top-center"
        richColors
        duration={30000}
      />

      {/* 项目标签栏 - 只在有多个项目时显示 */}
      {shouldShowProjectTabs && (
        <ProjectTabs
          projects={projects}
          activeProjectId={activeProjectId || ""}
          onSwitch={(newId) =>
            switchProject(
              newId
              // openFiles ?? [],
              // activeFile,
              // setFolderTree,
              // setOpenFiles,
              // setActiveFile
            )
          } // 使用新的处理函数
          onClose={(id) => closeProject(id)}
        />
      )}

      <div className="flex flex-1 overflow-hidden pt-2">
        {/* 最左侧菜单栏 */}
        <MenuPanel
          openSettings={() => setShowRightPanel(true)}
          toggleLeft={toggleLeftPanel}
        />

        {/* {isSettingsMode && (
          <SettingsPage onClose={() => setShowRightPanel(false)} />
        )} */}

        {/* {!isSettingsMode && ( */}
        <PanelGroup id="panelGroup" direction="horizontal" className="flex-1">
          {showLeftPanel ? (
            <>
              <Panel
                id="left"
                order={0}
                // onResize={(size) => console.log("Left panel size:", size)}
                ref={leftPanelRef}
                minSize={10}
                defaultSize={20}
                collapsible
                onCollapse={() => setShowLeftPanel(false)}
                onExpand={() => setShowLeftPanel(true)}
                className="border border-zinc-300 rounded-md overflow-hidden"
              >
                {/* 工作区域 - 放目录树 - 避免空projectRootPath路径时渲染 WorkSpaceTreePanel 组件 */}
                {projectRootPath && (
                  <div className="flex flex-col h-full">
                    <WorkSpaceTreePanel
                      projectId={projectId ?? null}
                      activeFilePath={projectActiveFilePath ?? null}
                      rootPath={projectRootPath}
                      folderTree={folderTree}
                    />
                  </div>
                )}
              </Panel>
              <PanelResizeHandle
                id="resize-left"
                className="w-1 cursor-col-resize"
              />
            </>
          ) : null}

          {/* 工作区域 - 放文件内容 */}
          <Panel
            id="main"
            order={2} // 明确设置order
            // onResize={(size) => console.log("Left panel size:", size)}
            minSize={30}
          >
            <MainContentTabs projectId={projectId ?? null} />
          </Panel>

          {/* 右侧面板 */}
          {/* {showRightPanel && !isSettingsMode && ( */}
          {showRightPanel ? (
            <>
              <PanelResizeHandle
                id="resize-right"
                className="w-1 cursor-col-resize"
              />
              <Panel
                id="right"
                order={3} // 明确设置order
                // onResize={(size) => console.log("Left panel size:", size)}
                className="border border-zinc-300 rounded-md overflow-hidden overflow-y-auto"
                minSize={10}
                defaultSize={25}
                collapsible
                onCollapse={() => setShowRightPanel(false)}
                onExpand={() => setShowRightPanel(true)}
              >
                <div className=" h-full overflow-hidden">
                  <RightPanel />
                </div>
              </Panel>
            </>
          ) : null}
        </PanelGroup>
        {/* )} */}
      </div>

      <Footer />
    </div>
  );
}
