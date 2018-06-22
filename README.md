# ThorifyTest

实现了基于thorify的ERC20 Token发布和一些主要的调用方法，仅供参考使用。

## 安装

首先需要本地安装Thor客户端，安装方式：[Thor传送门](https://github.com/vechain/thor). 

### 启动 Thor

使用solo方式启动，里面会有10个初始测试账号供测试使用

```
bin/thor solo
```

### 下载本项目并安装依赖

## 测试

发布ERC20 Token合约
```
npm run deploy
```

空投Token
```
npm run airdrop
```

授权Token并使用
```
npm run approve
```

销毁Token
```
npm run burn
```
查看Transfer Log
```
npm run eventlog
```