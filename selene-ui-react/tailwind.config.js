/** @type {import('tailwindcss').Config} */
// const typography = require('@tailwindcss/typography');

// module.exports = {
//     content: [
//         "./index.html",
//         "./src/**/*.{js,ts,jsx,tsx}",
//     ],
//     plugins: [typography],
//     darkMode: "class", // 使用 class 控制主题
//     theme: {
//         extend: {
//             colors: {
//                 greenTheme: { background: '#e0f2f1' },
//                 purpleTheme: { background: '#ede7f6' },
//             },
//         },
//     },
// }

// tailwind.config.ts（必须配合支持 ESM 的构建工具如 Vite）
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [typography],
  theme: {
    extend: {
      colors: {
        greenTheme: { background: '#e0f2f1' },
        purpleTheme: { background: '#ede7f6' },
      },
    },
  },
};

export default config;

