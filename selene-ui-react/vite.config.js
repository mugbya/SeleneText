import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import csp from 'vite-plugin-csp';
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.log("[vite.config.ts] __dirname: ", __dirname);


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    csp({
      enabled: true,
      policies: {
        'default-src': [`'self'`, 'http:', 'https:', 'data:', 'blob:'],
        'img-src': [`'self'`, 'data:', 'blob:', 'file:'],
        'script-src': [`'self'`, `'unsafe-inline'`, `'unsafe-eval'`],
        'style-src': [`'self'`, `'unsafe-inline'`],
      },
    }),
  ],
  css: {
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // <-- 关键配置
    },
  },
  base: './', // ✅ 避免路径丢失
  build: {
    outDir: resolve(__dirname, '../selene-client/renderer'), // <-- 指向 Electron 主进程目录
    emptyOutDir: true,
    rollupOptions: {
      external: [
        // 告诉 Rollup/Electron 这些包不要打包进 UI bundle
        'vscode-languageserver-types',
        'vscode-jsonrpc',
        '@chevrotain/regexp-to-ast',
        'vscode-jsonrpc/lib/common/cancellation.js',
        'vscode-jsonrpc/lib/common/events.js',
      ],
    },
  },

  // server: {
  //   headers: {
  //     'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:;",
  //   },
  // },
})


