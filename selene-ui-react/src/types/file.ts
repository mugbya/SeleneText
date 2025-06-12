
export type FileTab = {
    path: string;
    content: string;
};


export interface FileNode {
    name: string;             // 节点名（文件/文件夹）
    path: string;             // 绝对路径或唯一标识
    isDirectory: boolean;     // 是否是目录
    children?: FileNode[];    // 子节点（只有 isDirectory=true 时才可能有）
}

// export interface FolderTree {
export interface Folder {
    basePath: string;       // 根目录路径
    contents: FileNode[];   // 根目录下的文件树结构
}

export type ProjectTab = {
    // id: string; // 唯一标识，可用 uuid
    // name: string; // 项目名（可从路径中提取）
    // rootPath: string;
    // openFiles: FileTab[];
    // lastActiveFile: string | null;

    id: string;         // 唯一标识，可用 uuid 
    name: string;       // 项目名（可从路径中提取）
    // path: string;
    rootPath: string;   // 项目根目录路径
    folderTree?: FileNode[];
    openFiles?: FileTab[];
    lastActiveFile?: string | null;
};