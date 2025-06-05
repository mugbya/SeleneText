import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path' // <-- 需要引入 path 模块

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <-- 关键配置
    },
  },
})


