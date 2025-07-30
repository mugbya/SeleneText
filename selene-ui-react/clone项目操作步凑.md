本项目需要 yarn v4 版本, 如果不是需要先升级到 v4

建议使用 corepack (Node.js 16.10+ 内置) 安装

```bash
corepack enable
corepack prepare yarn@stable --activate

# 验证安装
yarn --version
# 应该显示 4.x.x

```

安装依赖

```bash
yarn install
```

启动项目

```bash
yarn dev
```

