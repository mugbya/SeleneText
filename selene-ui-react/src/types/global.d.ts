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
    };
  }
}