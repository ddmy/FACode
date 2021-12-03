const fs = require('fs')
const path = require('path')
const imgToBase64 = require('./imgToBase64')

function run () {
  // 检查启动参数
  const argv = {
    mode: 'JS',
    speed: 200,
    type: 'PNG',
    path: './',
    out: './'
  }

  process.argv.filter(item => item.includes('=')).forEach(item => {
    const arr = item.split('=')
    argv[arr[0]] = arr[1]
  })
  console.log('启动配置:', argv)
  
  
  const REDPATH = argv.path.endsWith('/') ? argv.path : argv.path + '/'
  const WRITEPATH = argv.out.endsWith('/') ? argv.out : argv.out + '/'
  const TYPE = argv.type.toLocaleUpperCase()
  
  
  
  // 收集帧动画路径所有图片信息
  const redPathOriginDir = fs.readdirSync(path.join(process.cwd(), REDPATH))

  // 将目录内合适的文件转成base64格式
  const redPathDir = redPathOriginDir
    .filter(item => item.toLocaleUpperCase().endsWith(TYPE.toLocaleUpperCase()))
    .sort((a, b) => a.split('.')[0] - b.split('.')[0])
    .map(item => imgToBase64(path.join(process.cwd(), REDPATH + item)))
  
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
    
    fs.writeFileSync(path.join(process.cwd(), WRITEPATH + ID + '.js'), jsTemp)
    
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
    cssTemp = cssTemp.replace(/(##ID##)/g, ID).replace('##IMG[0]##', redPathDir[0]).replace(/(##animationStepCss##)/g, animationStepCss)
    fs.writeFileSync(path.join(process.cwd(), WRITEPATH + ID + '.css'), cssTemp)
  
    console.log(`请引入${ID}.css文件, html 写入ID为'${ID}'的div`)
  
  }
}

module.exports = run
