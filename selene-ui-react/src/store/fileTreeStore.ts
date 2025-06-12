// stores/useFileTreeStore.ts
import { create } from "zustand";

export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

export interface FolderTree {
  basePath: string;
  contents: FileNode[];
}

interface FileTreeState {
  tree: FolderTree | null;               // 当前文件树（当前项目）
  trees: Record<string, FolderTree>; // key 是 basePath
  selectedPath: string | null;           // 当前选中的文件路径
  loading: boolean;                      // 是否在加载目录树

  setTree: (tree: FolderTree) => void;
  setTrees: (trees: FolderTree[]) => void;
  setSelectedPath: (path: string | null) => void;
  setLoading: (loading: boolean) => void;

  // 可选扩展方法：更新节点
  updateNode: (updatedNode: FileNode) => void;
}

export const useFileTreeStore = create<FileTreeState>((set, get) => ({
  tree: null,
  trees: {},
  selectedPath: null,
  loading: false,

  setTree: (tree) => set({ tree }),
  setSelectedPath: (path) => set({ selectedPath: path }),
  setLoading: (loading) => set({ loading }),

  setTrees: (trees: FolderTree[]) => {
    const map = Object.fromEntries(trees.map((tree) => [tree.basePath, tree]));
    set({ trees: map });
  },

  updateNode: (updatedNode) => {
    const { tree } = get();
    if (!tree) return;

    const update = (nodes: FileNode[]): FileNode[] =>
      nodes.map((node) => {
        if (node.path === updatedNode.path) return updatedNode;
        if (node.children) {
          return {
            ...node,
            children: update(node.children),
          };
        }
        return node;
      });

    const updatedTree: FolderTree = {
      ...tree,
      contents: update(tree.contents),
    };

    set({ tree: updatedTree });
  },

}));