
export interface SettingsPageProps {
    onClose: () => void;
}

export interface MenuPanelProps {
    openSettings: () => void;
    toggleLeft: () => void;
}

export type LeftMenuProps = {
    activeTab: 'base' | 'about';
    onTabChange: (tab: 'base' | 'about') => void;
};

export interface HeadProps {
    toggleLeft: () => void;
    toggleRight: () => void;
}

export interface LeftPanelProps {
    selectedPath: string | null;
    onFileSelect: (filePath: string) => void;
  }

export interface ResizablePanelProps {
    side: "left" | "right";
    width: number;
    onWidthChange: (width: number) => void;
    show: boolean;
    minWidth?: number;
    maxWidth?: number;
    children: React.ReactNode;
}
