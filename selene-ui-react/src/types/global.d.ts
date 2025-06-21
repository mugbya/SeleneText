export {};


declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (...args: any[]) => void) => void;
      invoke: (channel: string, data?: any) => Promise<any>;
      readFile: (filePath: string) => Promise<{ success: boolean; content: string}>;
      resolvePath: (path: string) => Promise<string>;
      dirname: (path: string) => string;
      
      removeAllListeners: (channel: string) => void;
      saveFile: (filePath: string, data: string) => Promise<void>;
      saveFileAs: (filePath: string, data: string) => Promise<{ success: boolean; filePath?: string }>;
      createFile: (dir: string, name: string) => Promise<{ success: boolean}>;
      createFolder: (dir: string, name: string) => Promise<{ success: boolean}>;

      deletePath: (path: string) => Promise<{ success: boolean}>;
      renamePath: (path: string, newName: string) => Promise<{ success: boolean}>;

      // showSaveDialog: (options: any) => Promise<{ filePath?: string }>;
      // writeFile: (filePath: string, content: string) => Promise<void>;

      // showAlert: (message: string) => Promise<void>;
    };
  }
}