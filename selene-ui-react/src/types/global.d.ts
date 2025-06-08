export {};

// declare global {
//     interface Window {
//         electronAPI: {
//             readFile: (filePath: string) => Promise<string>;
//         };
//     }
// }
declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (...args: any[]) => void) => void;
      invoke: (channel: string, data?: any) => Promise<any>;
      readFile: (filePath: string) => Promise<string>;
      resolvePath: (path: string) => Promise<string>;
      removeAllListeners: (channel: string) => void;
      saveFile: (filePath: string, data: string) => Promise<void>;
      saveFileAs: (filePath: string, data: string) => Promise<{ success: boolean; filePath?: string }>;
      createFile: (dir: string, name: string) => Promise<{ success: boolean}>;
      createFolder: (dir: string, name: string) => Promise<{ success: boolean}>;
    };
  }
}