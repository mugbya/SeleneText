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


export default function Layout() {
  useElectronEvents();
  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("\n[Layout] 执行渲染 count:", renderCount.current);

  const showLeftPanel = usePanelsStore((s) => s.showLeftPanel);
  const showRightPanel = usePanelsStore((s) => s.showRightPanel);
  const toggleLeftPanel = usePanelsStore((s) => s.toggleLeftPanel);
  const toggleRightPanel = usePanelsStore((s) => s.toggleRightPanel);
  const setShowRightPanel = usePanelsStore((s) => s.setShowRightPanel);
  const setShowLeftPanel = usePanelsStore((s) => s.setShowLeftPanel);
 
  return (
    <div className="flex flex-col h-screen bg-background text-foreground ">
      <Header toggleLeft={toggleLeftPanel} toggleRight={toggleRightPanel} />
      <Toaster position="top-center" richColors duration={30000} />

      <ProjectTabs /> {/* 内部自己取 projects 状态 */}

      <div className="flex flex-1 overflow-hidden pt-2">
        <MenuPanel openSettings={() => setShowRightPanel(true)} toggleLeft={toggleLeftPanel} />

        <PanelGroup id="panelGroup" direction="horizontal" className="flex-1">
          {showLeftPanel && (
            <>
              <Panel
                id="left"
                order={0}
                ref={leftPanelRef}
                minSize={10}
                defaultSize={20}
                collapsible
                onCollapse={() => setShowLeftPanel(false)}
                onExpand={() => setShowLeftPanel(true)}
                className="border border-zinc-300 rounded-md overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  <WorkSpaceTreePanel/>
                </div>
              </Panel>
              <PanelResizeHandle id="resize-left" className="w-1 cursor-col-resize" />
            </>
          )}

          <Panel id="main" order={2} minSize={30}>
            <MainContentTabs />
          </Panel>

          {showRightPanel && (
            <>
              <PanelResizeHandle id="resize-right" className="w-1 cursor-col-resize" />
              <Panel
                id="right"
                order={3}
                minSize={10}
                defaultSize={25}
                collapsible
                onCollapse={() => setShowRightPanel(false)}
                onExpand={() => setShowRightPanel(true)}
                className="border border-zinc-300 rounded-md overflow-hidden overflow-y-auto"
              >
                <div className=" h-full overflow-hidden">
                  <RightPanel />
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
      <Footer />
    </div>
  );
}