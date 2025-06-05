# selene-client


如果想清理依赖 重新安装，执行下面
```bash
rm -rf node_modules
rm -rf .yarn/unplugged
rm -rf .yarn/install-state.gz
rm yarn.lock

yarn cache clean
```

> 注意: electron 必须要要使用 nodeLinker: node-modules 方式，对 pnp  支持的很差，本项目已经在 `.yarnrc.yml` 中配置了，不需要再配置了


然后执行下面命令
```bash
yarn install

#如果因为网络问题一直卡住，那么可以使用下面命令
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ yarn install
```

启动
```bash
# 单独启动 electron 服务
yarn run start

# 启动 UI 服务跟 electron 服务
yarn dev

```


ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ yarn add -D electron-builder
