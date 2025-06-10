// hooks/usePanels.ts
import { useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

/**
 * 面板显示控制逻辑
 * @returns 
 */
export function usePanels() {
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [rightMode, setRightMode] = useState<"normal" | "settings">("normal");
  const leftPanelRef = useRef<ImperativePanelHandle>(null);

  const toggleLeft = () => {
    const panel = leftPanelRef.current;
    if (panel?.isCollapsed()) {
      panel.expand();
    } else {
      panel?.collapse();
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

  return {
    showLeftPanel,
    showRightPanel,
    rightMode,
    leftPanelRef,
    setShowLeftPanel,
    setShowRightPanel,
    setRightMode,
    toggleLeft,
    toggleRight,
  };
}