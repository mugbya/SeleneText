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

export default function Layout() {
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

  useFileSaveListener(openFiles, activeFile, setOpenFiles, setActiveFile);

  const isSettingsMode = rightMode === "settings";

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header toggleLeft={toggleLeft} toggleRight={toggleRight} />

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
              {/* 工作区域 - 放目录树   */}
              <WorkSpaceTreePanel
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
              />
            </Panel>

            <PanelResizeHandle className="w-1 cursor-col-resize" />

            {/* 工作区域 - 放文件内容   */}
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