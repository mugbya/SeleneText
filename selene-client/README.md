# selene-client


如果想清理依赖 重新安装，执行下面
```bash
rm -rf node_modules
rm -rf .yarn/unplugged
rm -rf .yarn/install-state.gz
rm yarn.lock
```

> 注意: electron 必须要要使用 nodeLinker: node-modules 方式，对 pnp  支持的很差，本项目已经在 `.yarnrc.yml` 中配置了，不需要再配置了


然后执行下面命令
```bash
yarn install
```

启动
```bash
yarn dev

yarn run start
```

