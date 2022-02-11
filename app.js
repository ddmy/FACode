const fs = require('fs')
const path = require('path')
const getArgv = require('./argv')
const imgToBase64 = require('./imgToBase64')
const write = require('./write')

function run () {
  // 检查启动参数
  const argv = getArgv()
  console.log('启动配置:', argv)
  
  const REDPATH = argv.path
  const WRITEPATH = argv.out.endsWith('/') ? argv.out : argv.out + '/'
  const TYPE = argv.type.toLocaleUpperCase()
  let intelUrl = false
  
  // 收集帧动画路径所有图片信息
  let redPathOriginDir = null
  try {
    redPathOriginDir = fs.readdirSync(path.join(process.cwd(), REDPATH))
  } catch (error) {
    try {
      if (argv.mode.toLocaleUpperCase() === 'CANVAS') {
        redPathOriginDir = fs.readFileSync(path.join(process.cwd(), REDPATH), 'utf-8')
        if (redPathOriginDir) {
          intelUrl = true
          redPathOriginDir = redPathOriginDir.replace(/(\n)|(\r\n)/g, ',').split(',').filter(item => item.trim())
        }
      } else {
        throw `当前路径不支持${argv.mode.toLocaleUpperCase()}`
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!redPathOriginDir) {
    throw 'redPathOriginDir 错误!'
  }
  
  let redPathDir = []

  if (intelUrl) {
    redPathDir = redPathOriginDir
  } else {
    // 将目录内合适的文件转成base64格式
    redPathDir = redPathOriginDir
      .filter(item => item.toLocaleUpperCase().endsWith(TYPE.toLocaleUpperCase()))
      .sort((a, b) => a.split('.')[0] - b.split('.')[0])
      .map(item => imgToBase64(path.join(process.cwd(), REDPATH.endsWith('/') ? REDPATH : REDPATH + '/' + item)))
  }

  if (redPathDir.length === 0) {
    throw '未找到合成图片!'
  }
  
  // 生成JS文件名和DIV ID
  const ID = String('DD' + Math.random()).replace('.', '')
  // JS 动画
  if (argv.mode.toLocaleUpperCase() === 'JS') {
    let jsTemp = fs.readFileSync(path.join(__dirname, './template/animationJs'), 'utf-8')
    jsTemp = jsTemp.replace('##ID##', ID)
              .replace('##IMGLIST##', JSON.stringify(redPathDir))
              .replace('##SPEED##', argv.speed)
    
    write(path.join(process.cwd(), WRITEPATH + ID + '.js'), jsTemp, argv.minify)
    
    console.log(`请引入${ID}.js文件, html 写入ID为'${ID}'的div`)
  }
  // CSS动画
  else if (argv.mode.toLocaleUpperCase() === 'CSS') {
    let animationStepCss = ''
    const stepLength = 100 / (redPathDir.length - 1)
    const stepAnimation = redPathDir.map((item, index) => {
      animationStepCss += `
      ${stepLength * index}% {
        background-image: url(${item})
      }
      `
    })
    let cssTemp = fs.readFileSync(path.join(__dirname, './template/animationCss'), 'utf-8')
    cssTemp = cssTemp.replace(/(##ID##)/g, ID)
              .replace('##SPEED##', (argv.speed / 1000) * redPathDir.length)
              .replace('##IMG[0]##', redPathDir[0])
              .replace(/(##animationStepCss##)/g, animationStepCss)

    write(path.join(process.cwd(), WRITEPATH + ID + '.css'), cssTemp, argv.minify)
  
    console.log(`请引入${ID}.css文件, html 写入ID为'${ID}'的div`)
  
  }
  // CANVAS 实现动画
  else if (argv.mode.toLocaleUpperCase() === 'CANVAS') {
    let jsTemp = fs.readFileSync(path.join(__dirname, './template/canvas'), 'utf-8')
    jsTemp = jsTemp.replace('##ID##', '#' + ID)
              .replace('##IMGLIST##', JSON.stringify(redPathDir))
              .replace('##SPEED##', argv.speed)
              .replace('##loading##', argv.loading)
    
    write(path.join(process.cwd(), WRITEPATH + ID + '.js'), jsTemp, argv.minify)
    
    console.log(`请引入${ID}.js文件, html 写入ID为'${ID}'的canvas标签`)
  }
}

module.exports = run
