import Header from "./modules/Header";
import WorkSpaceTreePanel from "./modules/WorkSpaceTreePanel";
import MainContentTabs from "./modules/MainContentTabs";
import RightPanel from "./modules/RightPanel";
import Footer from "./modules/Footer";
import MenuPanel from "@/modules/MenuPanel";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import ProjectTabs from "./modules/ProjectTabs";
// import { useElectronEvents } from "./useElectronEvents";
import { useProjectsStore } from "./store/projectsStore";
import { useFileTabsStore } from "./store/fileTabsStore";
import { usePanelsStore } from "./store/panelsStore";
// import { useFileTreeStore } from "./store/fileTreeStore";

export default function Layout() {
  // useElectronEvents();
  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  // Projects 状态
  const projects = useProjectsStore((s) => s.projects);
  const activeProjectId = useProjectsStore((s) => s.activeProjectId);
  //  const setActiveProjectId = useProjectsStore((s) => s.setActiveProjectId);
  const getActiveProject = useProjectsStore((s) => s.getActiveProject);
  //  const updateProjectFiles = useProjectsStore((s) => s.updateProjectFiles);
  //  const addProject = useProjectsStore((s) => s.addProject);
  const closeProject = useProjectsStore((s) => s.closeProject); // 如果你在用
  const switchProject = useProjectsStore((s) => s.switchProject);

  // FileTabs 状态
  const openFiles = useFileTabsStore((s) => s.openFiles);
  const activeFile = useFileTabsStore((s) => s.activeFile);
  const setOpenFiles = useFileTabsStore((s) => s.setOpenFiles);
  const setActiveFile = useFileTabsStore((s) => s.setActiveFile);
  const addFile = useFileTabsStore((s) => s.addFile);
  const closeFile = useFileTabsStore((s) => s.closeFile);
  const changeFileContent = useFileTabsStore((s) => s.changeFileContent);

  // Panels 状态
  //  const showLeftPanel = usePanelsStore((s) => s.showLeftPanel);
  const showRightPanel = usePanelsStore((s) => s.showRightPanel);
  //  const rightMode = usePanelsStore((s) => s.rightMode);
  const toggleLeftPanel = usePanelsStore((s) => s.toggleLeftPanel);
  const toggleRightPanel = usePanelsStore((s) => s.toggleRightPanel);
  const setShowRightPanel = usePanelsStore((s) => s.setShowRightPanel);
  const setShowLeftPanel = usePanelsStore((s) => s.setShowLeftPanel);

  // FileTreeState
  //  const trees = useFileTreeStore((s) => s.trees);
  //  const setTrees = useFileTreeStore((s) => s.setTrees);

  const activeProject = getActiveProject();
  const rootPath = activeProject?.rootPath;
  const name = activeProject?.name;

  const folderTree = activeProject?.folderTree;
  


  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("\n[Layout] 执行渲染 count:", renderCount.current);

  // 只有多个项目时才显示标签页
  const shouldShowProjectTabs = projects.length > 1;
  // console.log("\n[Layout] 执行渲染....");
  console.log(
    "[Layout] 当前项目数量：%s, rootPath: %s",
    projects.length,
    rootPath
  );
  console.log("[Layout] openFiles：%o", openFiles);

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
              // setFolderTree,
              setOpenFiles,
              setActiveFile
            )
          } // 使用新的处理函数
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
            onCollapse={() => setShowLeftPanel(false)}
            onExpand={() => setShowLeftPanel(true)}
            className="border border-zinc-300 rounded-md overflow-hidden"
          >
            {/* 工作区域 - 放目录树 - 避免空rootPath路径时渲染 WorkSpaceTreePanel 组件 */}
            {rootPath && (
              <WorkSpaceTreePanel
                selectedPath={activeFile}
                name={name? name:""}
                rootPath={rootPath}
                folderTree = {folderTree}

                // 点击读取文件内容
                onFileSelect={(filePath) => {
                  window.electronAPI
                    .readFile(filePath)
                    .then(({ success, content }) => {
                      if (!success) {
                        console.error("读取文件失败！");
                        return;
                      }
                      console.log("[Layout] 读取文件内容：%s", content);

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
