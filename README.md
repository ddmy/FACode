# 帧动画代码插件

### 浏览器使用环境使用

```js
npm install facode@2.0.1

import FaCode from 'facode'

new Facode(options)
```

### 命令行工具版本
[工具版地址](https://www.npmjs.com/package/facode/v/1.0.11)
```js
npm install facode@1.0.11 -g
```

### options

| 参数名 | 取值 | 默认值 |说明 |
| ------ | ------ | ------ | ------ |
| id | String | null | 帧动画盒子ID |
| imgList | Array | [] | 图片网络资源地址集合 |
| mode | String | 'js' | 帧动画实现方式, 取值范围 'js','css','canvas'|
| speed | int | 200 |逐帧动画间隔时长 |
| loading | Boolean | `true` |是否需要展示loading|
| admissionIndex | Number | 0 |入场动画最后一张索引(仅支持`canvas`和`js`模式)|
| loadingFn | Function | null| 自定义生成loading动画 |

### 注意事项
- 如果打包工具不支持class私有属性，可以借助`babel`的`@babel/plugin-proposal-private-methods`插件