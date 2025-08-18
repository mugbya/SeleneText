
export type FileTab = {
    path: string;          // 当前 UI 内部唯一标识，可是 untitled-xxx.txt
    content?: string | null;       // 文件内容
    realPath?: string;     // 真实磁盘路径，首次保存后写入
    isTemporary?: boolean; // true 表示未保存的虚拟文件
    mode?: 'wysiwyg' | 'source';
    markdown?: string;
};

export interface FileNode {
    name: string;             // 节点名（文件/文件夹）
    path: string;             // 绝对路径或唯一标识
    isDirectory: boolean;     // 是否是目录
    children?: FileNode[];    // 子节点（只有 isDirectory=true 时才可能有）
}

export interface Folder {
    basePath: string;       // 根目录路径
    contents: FileNode[];   // 根目录下的文件树结构
}
export type ProjectTab = {
    id: string;         // 唯一标识，可用 uuid 
    name: string;       // 项目名（可从路径中提取）
    rootPath: string;       // 项目根目录路径
    folderTree: FileNode;  // 项目的文件树结构
    openFiles: FileTab[];   // 项目下打开的文件列表
    lastActiveFile: string | null; // 项目下当前的激活的文件
    expandedKeys: string[];     // 展开的节点的 key
};




// id: string; // 唯一标识，可用 uuid
// name: string; // 项目名（可从路径中提取）
// rootPath: string;
// openFiles: FileTab[];
// lastActiveFile: string | null;
// openFiles: string[]; // 打开文件的路径列表
// filesContent: Record<string, string>; // 打开文件的内容缓存
// path: string;

// export interface FolderTree {
export interface Folder {
    basePath: string;       // 根目录路径
    contents: FileNode[];   // 根目录下的文件树结构
}