import React, { useState, useRef } from "react";
import Header from "./modules/Header";
import LeftPanel from "./modules/LeftPanel";
import MainContent from "./modules/MainContent";
import MainContentLocal from "./modules/MainContentLocal";
import RightPanel from "./modules/RightPanel";
import Footer from "./modules/Footer";
import ResizablePanel from "./modules/ResizablePanel";
import MenuPanel from "@/modules/MenuPanel";
import SettingsPage from "@/modules/SettingsPage";

export default function Layout() {
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(false);
    const [leftWidth, setLeftWidth] = useState(240); // px
    const [rightWidth, setRightWidth] = useState(320); // px
    const [rightMode, setRightMode] = useState<"normal" | "settings">("normal");

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>("");

    const openSettings = () => {
        setRightMode("settings");
        setShowRightPanel(true);
    };

    const closeSettings = () => {
        setRightMode("normal");
    };

    const toggleLeft = () => setShowLeftPanel(prev => !prev);

    const toggleRight = () => {
        if (showRightPanel && rightMode === "settings") {
            setShowRightPanel(false);
            setRightMode("normal");
        } else {
            setRightMode("normal");
            setShowRightPanel(prev => !prev);
        }
    };

    const isSettingsMode = rightMode === "settings";


    return (
        // 整个页面
        <div className="flex flex-col h-screen bg-background text-foreground">
            {/* 顶部 Header */}
            <Header
                toggleLeft={toggleLeft}
                toggleRight={toggleRight}
            />


            {/* 主体区域：左右中布局 */}
            <div className="flex flex-1 overflow-hidden">
                {/* 左侧 Panel */}
                <MenuPanel openSettings={openSettings} toggleLeft={toggleLeft} />

                {/*显示设置详情*/}
                {isSettingsMode && <SettingsPage onClose={closeSettings} />}

                {!isSettingsMode && (
                    <ResizablePanel
                        side="left"
                        width={leftWidth}
                        onWidthChange={setLeftWidth}
                        show={showLeftPanel}
                    >
                        {/* <LeftPanel
                            onFileSelect={(filePath) => {
                                setSelectedFile(filePath);
                                // 通过 Electron 获取文件内容
                                window.electronAPI.readFile(filePath).then(setFileContent);
                            }}
                        /> */}
                        <LeftPanel
                            selectedPath={selectedFile}
                            onFileSelect={(filePath) => {
                                setSelectedFile(filePath);
                                window.electronAPI.readFile(filePath).then(setFileContent);
                            }}
                        />
                    </ResizablePanel>
                )}

                {/* 中间内容区 */}
                {!isSettingsMode && <MainContent filePath={selectedFile} content={fileContent} />}
                {/* {!isSettingsMode && <MainContentLocal />}  */}

                {/* 右侧 Panel */}
                {!isSettingsMode && showRightPanel && (
                    <ResizablePanel
                        side="right"
                        width={rightWidth}
                        onWidthChange={setRightWidth}
                        show={showRightPanel}
                    >
                        <RightPanel />
                    </ResizablePanel>
                )}
            </div>

            {/* 底部区域 */}
            <Footer />
        </div>
    );
}
