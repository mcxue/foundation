blacklake web

## 初始

```
npm i
npm lerna -g
npm run init

```

## 调试

1. 执行 打包命令, 如 `npm run build:component`。
2. 去当前对应工程目录，拷贝出 `dist` 目录, 如 改动了 component 中的组件，则拷贝打包之后的目录 `packages/component/dist`
3. 替换目标工程的 node_modules 中去，如 替换到这个目录`node_modules/@blacklake-web/component/dist` 中的 `dist`
4. 重新启动目标工程

## 更新线上文档

```
npm run docs:deploy

```

## 发版

```
npm run publish

// 小版本号更新 选择Custom Version
// 输入版本号以此类推
1.0.14-alpha.1
1.0.14-alpha.2
1.0.14-alpha.3

发版成功之后到 https://github.com/blacklake-web/foundation/releases 对应的tag写上更新的内容

npm 更新需要时间, 版本更新比较费时耐心等待

```
