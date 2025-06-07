
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

export interface FolderTree {
    basePath: string;       // 根目录路径
    contents: FileNode[];   // 根目录下的文件树结构
}