# 帧动画代码生成工具
> 本工具适用于特定场景，自动生成代码，代码目的于将多个图片通过代码实现帧动画

### 命令行参数
| 参数名 | 取值 | 说明 |
| ------ | ------ | ------ |
| mode | 'JS','CSS' | 帧动画实现方式，默认JS |
| speed | int | 逐帧动画间隔时长，默认200毫秒 |
| type | string | 要合成的图片格式，默认PNG |
| path | string | 输入图片路径 |
| out | string | 输出代码文件路径 |

### 使用须知
- 请将要合成的图片全部整理放到同一文件夹下
- 请将要合成的图片用数字命名，按顺序，从0开始
- 请将要合成的图片格式，文件名后缀进行统一
- 生成的代码文件请按照对应格式引入方式引入到html文件中
- 页面中动画位置，添加div，div设置id为生成的代码文件的名称

### 运行命令
`
node app.js mode=css path=./img/ out=./dist/
`