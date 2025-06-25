import { FileNode } from "./file";

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

export interface WorkspaceTreeProps {
    projectId: string | null;
    activeFilePath: string | null;
    // name:string;    // 工作区名称
    rootPath: string; // 添加rootPath作为可选属性
    // folderTree?: FileNode[]; // 文件树数据
    folderTree?: FileNode; // 文件树数据
    // onFileSelect: (filePath: string) => void; // 打开的文件阿胶
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
