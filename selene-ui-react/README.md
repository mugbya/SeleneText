# React + Vite

创建 Vite + React 项目
```bash
yarn create vite selene-ui-react --template react
cd selene-ui-react
yarn
yarn dev
```

避免 tsx 文件一直报错
```bash
yarn add react react-dom
yarn add -D typescript @types/react @types/react-dom
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

```

你可以在页面中使用：
```tsx
<Button variant="default">Hello Shadcn</Button>
```
