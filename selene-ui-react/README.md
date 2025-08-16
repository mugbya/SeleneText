# React + Vite

创建 Vite + React 项目

```bash
yarn create vite selene-ui-react --template react
cd selene-ui-react
yarn
yarn dev
```

一键解决方案（彻底重装 PnP 依赖）
```bash
# 清理 Yarn 缓存
yarn cache clean

# 删除 node_modules 和虚拟包缓存
rm -rf node_modules .yarn/__virtual__ .yarn/cache

# 重新安装所有依赖
yarn install --immutable
```


避免 tsx 文件一直报错

```bash
yarn add react react-dom
yarn add -D typescript @types/react @types/react-dom

yarn add @milkdown/core@7.14.0 @milkdown/preset-commonmark@7.14.0 @milkdown/prose@7.14.0 mermaid 

yarn add @milkdown/core@7.14.0 \
         @milkdown/prose@7.14.0 \
         @milkdown/utils@7.14.0 \
         @milkdown/preset-commonmark@7.14.0 \
         @milkdown/plugin-listener@7.14.0 \
         @milkdown/plugin-cursor@7.14.0 \
         @milkdown/plugin-block@7.14.0

```


安装 Tailwind CSS

```bash
# yarn remove postcss
yarn add -D tailwindcss  autoprefixer
yarn add tailwindcss @tailwindcss/vite
```

`shadcn/ui` 是一个基于 React 和 Tailwind CSS 的现代化 UI 组件库

```bash
yarn dlx shadcn@latest init
```

安装组件，例如：

```bash
yarn dlx shadcn@latest add button
yarn dlx shadcn@latest add card scroll-area
yarn dlx shadcn@latest add dropdown-menu
yarn dlx shadcn@latest add tabs
yarn dlx shadcn@latest add textarea
yarn dlx shadcn@latest add input dialog
yarn dlx shadcn@latest add context-menu radio-group

```

你可以在页面中使用：

```tsx
<Button variant="default">Hello Shadcn</Button>
```

构建配置 参考 `vite.config.js`

```bash
# 构建
yarn build

# 构建后预览
yarn preview
```

```
➜  selene-ui-react git:(develop) ✗ tree -L 3

├── README.md
├── clone项目操作步凑.md
├── components.json
├── eslint.config.js
├── index.html
├── node_modules
├── package.json
├── public
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── Layout.tsx
│   ├── assets
│   ├── components
│   │   ├── FileTree.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ui
│   ├── constants
│   │   └── theme.ts
│   ├── hooks
│   │   └── useI18n.ts
│   ├── i18n
│   ├── index.css
│   ├── lib
│   │   ├── theme-provider.tsx
│   │   └── utils.ts
│   ├── main.tsx
│   ├── modules
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── LeftPanel.tsx
│   │   ├── MainContent.tsx
│   │   ├── MainContentLocal.tsx
│   │   ├── MainContentTabs.tsx
│   │   ├── MenuPanel.tsx
│   │   ├── ResizablePanel.tsx
│   │   ├── RightPanel.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── settings
│   │   └── viewer
│   └── types
│       ├── file.ts
│       ├── global.d.ts
│       ├── images.d.ts
│       ├── index.ts
│       ├── props.ts
│       └── react-markdown.d.ts
├── tailwind.config.js
├── tsconfig.json
├── vite.config.js
└── yarn.lock

```

```
src/
├── components/
├── hooks/         ← ✅ 状态逻辑封装
├── pages/
├── styles/
├── types/
└── utils/
```

