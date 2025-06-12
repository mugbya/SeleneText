import { FileTab } from '@/types';
import { create } from 'zustand';

interface FileTabsStore {
  openFiles: FileTab[];
  activeFile: string | null;
  addFile: () => void;
  openFile: (path: string, projectRoot: string) => Promise<void>;
  closeFile: (path: string) => void;
  changeFileContent: (path: string, content: string) => void;
  // setOpenFiles: (files: FileTab[]) => void;
  setOpenFiles: (files: FileTab[] | ((prev: FileTab[]) => FileTab[])) => void;
  setActiveFile: (file: string | null) => void;
}

export const useFileTabsStore = create<FileTabsStore>((set, get) => ({
  openFiles: [],
  activeFile: null,

  addFile: () => {
    const count = get().openFiles.filter(f => f.path.startsWith("Untitled-")).length + 1;
    const newPath = `Untitled-${count}.txt`;
    set(state => ({
      openFiles: [...state.openFiles, { path: newPath, content: "" }],
      activeFile: newPath,
    }));
  },

  openFile: async (filePath, projectRoot) => {
    if (!filePath.startsWith(projectRoot)) return;
    const existing = get().openFiles.find(f => f.path === filePath);
    if (existing) {
      set({ activeFile: existing.path });
      return;
    }
    const res = await window.electronAPI.readFile(filePath);
    if (res.success) {
      set((state) => ({
        openFiles: [...state.openFiles, { path: filePath, content: res.content }],
        activeFile: filePath,
      }));
    }
  },

  closeFile: (path) => {
    const { openFiles, activeFile } = get();
    set({
      openFiles: openFiles.filter(f => f.path !== path),
      activeFile: activeFile === path ? null : activeFile,
    });
  },

  changeFileContent: (path, content) => {
    set(state => ({
      openFiles: state.openFiles.map(f =>
        f.path === path ? { ...f, content } : f
      ),
    }));
  },

  setOpenFiles: (updater) =>
    set((state) => {
      const newFiles = typeof updater === "function"
        ? updater(state.openFiles)
        : updater;
      return { openFiles: newFiles };
    }),

  // setOpenFiles: (files) => set({ openFiles: files }),
  setActiveFile: (file) => set({ activeFile: file }),
}));