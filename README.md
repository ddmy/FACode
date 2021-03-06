# 帧动画代码生成工具

> 本工具适用于特定场景，自动生成代码，代码目的于将多个图片通过代码实现帧动画

### 全局工具安装

```js
npm install facode -g
```

### 浏览器使用
> [参见browser分支@2.x](https://www.npmjs.com/package/facode/v/2.0.0)
```js
npm install facode@2.0.0
```

### 使用

```js
fa mode=canvas type=jpg speed=100
```

### 生成帧动画代码

在图片文件夹目录下直接运行`fa`或通过`path=`指定图片文件目录

### 命令行参数

| 参数名 | 取值 | 默认值 |说明 |
| ------ | ------ | ------ | ------ |
| mode | String | 'js' | 帧动画实现方式, 取值范围 'js','css','canvas'|
| speed | int | 200 |逐帧动画间隔时长 |
| type | string | 'png' |要合成的图片格式 |
| path | string | './' |输入图片路径 |
| out | string | './' |输出代码文件路径 |
| loading | Boolean | `true` |是否需要展示loading, 仅支持`js`和`canvas` |
| minify | Boolean | `true` | 是否压缩生成的文件(css模式不支持) |

> `path` 参数在正常情况下是一个图片文件夹路径， 在`mode`为`canvas`和`js` 时, `path` 可以是一个文件路径，该文件内容为多个图片的网络资源资源地址，使用正常换行符分割

### 使用须知

- 请将要合成的图片全部整理放到同一文件夹下
- 请将要合成的图片用数字命名，按顺序，从0开始
- 请将要合成的图片格式，文件名后缀进行统一
- 生成的代码文件请按照对应格式引入方式引入到html文件中
- 页面中动画位置，添加对应标签，标签设置id为生成的代码文件的名称

### 注意事项

- 当图片过多时，生成的文件会过大, 建议选择 `mode=canvas` + `path` 为网络资源地址的方式
