# 帧动画代码插件

### 浏览器使用环境使用

```js
npm install facode@2.0.0

import FaCode from 'facode'

new Facode(options)
```

### options

| 参数名 | 取值 | 默认值 |说明 |
| ------ | ------ | ------ | ------ |
| id | String | null | 帧动画盒子ID |
| imgList | Array | [] | 图片网络资源地址集合 |
| mode | String | 'js' | 帧动画实现方式, 取值范围 'js','css','canvas'|
| speed | int | 200 |逐帧动画间隔时长 |
| loading | Boolean | `true` |是否需要展示loading|
| loadingFn | Function | null| 自定义生成loading动画 |

### 注意事项
- 如果打包工具不支持class私有属性，可以借助`babel`的`@babel/plugin-proposal-private-methods`插件