import React, { useState, useEffect } from "react";
import Header from "./modules/Header";
import LeftPanel from "./modules/LeftPanel";
// import MainContent from "./modules/MainContent";
import MainContentTabs from "./modules/MainContentTabs";
// import MinimalEditor from "./modules/test/MinimalEditor";
import RightPanel from "./modules/RightPanel";
import Footer from "./modules/Footer";
import MenuPanel from "@/modules/MenuPanel";
import SettingsPage from "@/modules/SettingsPage";
import { useRef } from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";
import type { FileTab } from "@/types";
import {handleFileSave} from "@/logic/fileSaver";

export default function Layout() {
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [rightMode, setRightMode] = useState<"normal" | "settings">("normal");

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  const [openFiles, setOpenFiles] = useState<FileTab[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const [newFileCounter, setNewFileCounter] = useState(1); // 文件编号

  const handleAddFile = () => {
    const newPath = `Untitled-${newFileCounter}.txt`;
    setOpenFiles((prev) => [...prev, { path: newPath, content: "" }]);
    setActiveFile(newPath);
    setNewFileCounter((c) => c + 1);
  };

  const openSettings = () => {
    setRightMode("settings");
    setShowRightPanel(true);
  };

  const closeSettings = () => {
    setRightMode("normal");
  };
  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  const toggleLeft = () => {
    const panel = leftPanelRef.current;
    if (!panel) return;

    if (panel.isCollapsed()) {
      panel.expand(); // 👈 展开
    } else {
      panel.collapse(); // 👈 折叠
    }
  };

  const toggleRight = () => {
    if (showRightPanel && rightMode === "settings") {
      setShowRightPanel(false);
      setRightMode("normal");
    } else {
      setRightMode("normal");
      setShowRightPanel((prev) => !prev);
    }
  };

  const isSettingsMode = rightMode === "settings";

  useEffect(() => {
      const api = window.electronAPI;

      if (!api || !api.on) {
        console.warn(
            "⚠️ electronAPI 未注入，请检查 preload 配置或 contextIsolation 设置"
        );
        return;
      }

    const handler = async () => {
      const current = openFiles.find((f) => f.path === activeFile);
      await handleFileSave(current, (oldPath, updated) => {
        setOpenFiles((prev) =>
            prev.map((f) => (f.path === oldPath ? updated : f))
        );
        setActiveFile(updated.path);
      });
    };

    api?.on?.("file-save", handler);

    // 清除旧监听，防止重复绑定
    return () => {
      api?.removeAllListeners?.("file-save");
    };
  }, [openFiles, activeFile]);


  return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        {/* 顶部 Header */}
        <Header toggleLeft={toggleLeft} toggleRight={toggleRight} />

        {/* 主体布局区域 */}
        <div className="flex flex-1 overflow-hidden">
          <MenuPanel openSettings={openSettings} toggleLeft={toggleLeft} />

          {isSettingsMode && <SettingsPage onClose={closeSettings} />}

          {!isSettingsMode && (
              <PanelGroup direction="horizontal" className="flex-1">
                {/* 左侧 Panel */}
                <Panel
                    className="border border-zinc-300 rounded-md overflow-hidden"
                    ref={leftPanelRef}
                    minSize={10}
                    defaultSize={20}
                    collapsible
                    onCollapse={() => setShowLeftPanel(false)}
                    onExpand={() => setShowLeftPanel(true)}
                >
                  <div className="h-full rounded-lg overflow-hidden">
                    {/* <LeftPanel
                  selectedPath={selectedFile}
                  onFileSelect={(filePath) => {
                    setSelectedFile(filePath);
                    window.electronAPI.readFile(filePath).then(setFileContent);
                  }}
                /> */}
                    {/* <LeftPanel
                        selectedPath={selectedFile}
                        onFileSelect={(filePath) => {
                          window.electronAPI
                              .readFile(filePath)
                              .then((content: string) => {
                                setOpenFiles((prev) => {
                                  const exists = prev.find((f) => f.path === filePath);
                                  if (exists) return prev;
                                  return [...prev, { path: filePath, content }];
                                });
                                setActiveFile(filePath);
                              });
                        }}
                    /> */}
                  </div>
                </Panel>

                <PanelResizeHandle className="w-1 cursor-col-resize" />

                {/* 中间内容区 */}
                <Panel minSize={30}>
                  {/* <MainContent filePath={selectedFile} content={fileContent} /> */}
                  {/* <MinimalEditor /> */}
                  <MainContentTabs
                      openFiles={openFiles}
                      activeFile={activeFile}
                      onSwitchFile={setActiveFile}
                      onCloseFile={(path) => {
                        setOpenFiles((files) => files.filter((f) => f.path !== path));
                        if (activeFile === path) setActiveFile(null);
                      }}
                      onAddFile={() => {
                        const newPath = `Untitled-${Date.now()}.txt`;
                        setOpenFiles((files) => [
                          ...files,
                          { path: newPath, content: "" },
                        ]);
                        setActiveFile(newPath);
                      }}
                      onChangeFileContent={(path, content) => {
                        setOpenFiles((files) =>
                            files.map((f) => (f.path === path ? { ...f, content } : f))
                        );
                      }}
                  />
                </Panel>

                {/* 右侧设置面板（可选） */}
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
                        <div className=" h-full overflow-hidden">
                          <RightPanel />
                        </div>
                      </Panel>
                    </>
                )}
              </PanelGroup>
          )}
        </div>

        {/* 底部区域 */}
        <Footer />
      </div>
  );
}
