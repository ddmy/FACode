class FaCode {
  constructor (options) {
    const {
      mode = 'JS',
      speed = 200,
      imgList = [],
      id = '',
      loading = true,
      loadingFn = null
    } = options
    this.id = id
    this.mode = mode
    this.speed = speed
    this.imgList = imgList
    this.loading = loading
    this.resultImg = []
    this.loadingFn = loadingFn
    if (!this.id) throw new Error('need id!')
    this.creatFaCode()
  }
  creatFaCode () {
    this.#startLoading()
    this.#loadImgList().then(res => {
      this.resultImg = res
      switch (this.mode.toLocaleUpperCase()) {
        case 'CSS':
          this.initCss()
          break;
        case 'JS':
          this.initJs()
          break;
        case 'CANVAS':
          this.initCanvas()
          break;
      }
    }).catch(err => {
      console.error(err)
    })
  }
  initCss () {
    this.removeLoading()
    const base64List = this.resultImg.map(img => {
      var canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, img.width, img.height)
      return canvas.toDataURL("image/png")
    })

    console.log('css:img:', base64List)

    const stepLength = 100 / (base64List.length - 1)
    let animationStepCss = `@keyframes ${this.id}animation {`
    base64List.forEach((item, index) => {
      animationStepCss += `
        ${index * stepLength}% {
          background-image: url(${item})
        }
      `
    })
    animationStepCss += '}'
    const animationBoxCss = `
      #${this.id} {
        width: 100%;
        height: 100%;
        animation-name: ${this.id}animation;
        animation-duration: ${this.speed / 1000 * base64List.length }s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        background-image: url(${base64List[0]});
        background-repeat: no-repeat;
        background-size: cover;
      }
    `
    const css = document.createElement('style')
    css.innerHTML = animationBoxCss + animationStepCss
    document.querySelector('head').appendChild(css)
  }
  initJs () {
    this.removeLoading()
    document.querySelector(`#${this.id}`).append(...this.resultImg)
    const imgs = document.querySelectorAll(`#${this.id} img`)

    imgs.forEach(item => item.style.opacity = 0)
    imgs[0].style.opacity = 1

    let animationIndex = 1
    setInterval(() => {
      imgs.forEach((item, index) => {
        item.style.opacity = index === animationIndex ? 1 : 0
      })
      animationIndex++
      if (animationIndex === imgs.length) {
        animationIndex = 0
      }
    }, this.speed)
  }
  initCanvas () {
    clearInterval(this.loadingTimer)
    let drawIndex = 0
    setInterval(() => {
      this.setDrawImage(this.resultImg[drawIndex])
      drawIndex++
      if (drawIndex === this.resultImg.length) {
        drawIndex = 0
      }
    }, this.speed)
  }

  #startLoading () {
    if (this.loading) {
      if (this.loadingFn && typeof this.loadingFn === 'function') {
        if (this.mode.toLocaleUpperCase() === 'CANVAS') {
          this.#initCanvasBefor()
        }
        this.loadingFn()
      } else {
        if (this.mode.toLocaleUpperCase() === 'CANVAS') {
          this.#initCanvasBefor()
          this.canvasLoading()
        } else {
          this.initLoading()
        }
      }
    }
  }

  #initCanvasBefor () {
    // 获取canvas的父级dom宽高
    const dom = document.querySelector(`#${this.id}`)
    const parent = dom.parentNode
    parent.removeChild(dom)
    const canvas = document.createElement('canvas')
    canvas.id = this.id
    parent.append(canvas)
    this.canvaDom = document.querySelector(`#${this.id}`)
    // 计算盒子实际设置的内容区域宽高, 设置canva宽高
    const style = getComputedStyle(this.canvaDom.parentElement, null)
    const paddingTop = parseInt(style.getPropertyValue('padding-top'))
    const paddingBottom = parseInt(style.getPropertyValue('padding-bottom'))
    const paddingLeft = parseInt(style.getPropertyValue('padding-left'))
    const paddingRight = parseInt(style.getPropertyValue('padding-right'))

    const canvaWidth = this.canvaDom.parentElement.clientWidth - paddingLeft - paddingRight
    const canvaHeight = this.canvaDom.parentElement.clientHeight - paddingTop - paddingBottom

    this.canvaDom.width = canvaWidth
    this.canvaDom.height = canvaHeight

    this.maxLength = canvaWidth > canvaHeight ? canvaWidth : canvaHeight
    this.loadingTimer = null
  }

  #computedCanvasLength (width, height) {
    if (width === height) {
      return [this.maxLength, this.maxLength]
    }
    let max = 'width'
    if (height > width) {
      max = 'height'
    }
    let result = [this.maxLength]
    if (max === 'width') {
      result[1] = this.maxLength / (width / height)
    } else if (max === 'height') {
      result[1] = this.maxLength * (width / height)
    }
    return result
  }

  setDrawImage (img) {
    this.#clearCanvas()
    if (!this.ctx) {
      this.#setCtx()
    }
    if (this.ctx) {
      this.ctx.drawImage(img, 0, 0, ...this.#computedCanvasLength(img.width, img.height))
    }
  }

  canvasLoading () {
    if (!this.ctx) {
      this.#setCtx()
    }
    let w = this.canvaDom.width,
        h = this.canvaDom.height,
        x = w/2,
        y = h/2,
        radius = 30,
        r = [3,4,4.5,5,6,7],
        angle = [10,25,45,65,90,120],
        alpha = [0.25,0.35,0.45,0.65,0.8,1],
        x1=[],
        y1=[];

    this.ctx.fillStyle = "#FFF"
    this.ctx.fillRect(0,0,w,h)

    clearInterval(this.loadingTimer)

    this.loadingTimer = setInterval(() => {
      this.ctx.fillStyle = "#FFF"
      this.ctx.fillRect(0,0,w,h)
      x1 = []
      y1 = []
      for(var i = 0; i < r.length; i ++){
          if(angle[i] >= 360) angle[i] = 0
          this.ctx.beginPath()
          this.ctx.font = "1rem sans-serif"
          this.ctx.fillStyle = "rgba(200,200,200,"+alpha[i]+")"
          x1.push( x + radius*Math.cos(angle[i]*Math.PI/180))
          y1.push( y + radius*Math.sin(angle[i]*Math.PI/180))
          this.ctx.arc(x1[i],y1[i],r[i],0,2*Math.PI, true)
          this.ctx.closePath()
          this.ctx.fill()
          angle[i] += 5
      }
    }, 25)
  }

  #setCtx() {
    this.ctx = this.canvaDom && this.canvaDom.getContext('2d')
  }

  #clearCanvas () {
    if (!this.ctx) {
      this.#setCtx()
    } else if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvaDom.width, this.canvaDom.height)
    }
  }

  #loadImgList () {
    return new Promise((resolve, reject) => {
      const resultImg = []
      this.imgList.forEach((item, index) => {
        const img = new Image()
        img.src = item
        img.setAttribute('crossOrigin', 'anonymous')
        img.onload = () => {
          resultImg[index] = img
          if (resultImg.filter(item => item).length === this.imgList.length) {
            resolve(resultImg)
          }
        }
        img.onerror = reject
      })
    })
  }

  initLoading () {
    const div = document.createElement('div')
    div.className = 'loadEffect'
    div.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>'
    const cssText = `
    #${this.id} {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    #${this.id} img {
      position: absolute;
      max-width: 100%;
      max-height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .loadEffect {
      width: 100px;
      height: 100px;
      position: relative;
      margin: 0 auto;
      margin-top: 100px;
    }
    
    .loadEffect span {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgba(200, 200, 200);
      position: absolute;
      -webkit-animation: load 1.04s ease infinite;
    }
    
    @-webkit-keyframes load {
      0% {
        opacity: 1;
      }
    
      100% {
        opacity: 0.2;
      }
    }
    
    .loadEffect span:nth-child(1) {
      left: 0;
      top: 50%;
      margin-top: -8px;
      -webkit-animation-delay: 0.13s;
    }
    
    .loadEffect span:nth-child(2) {
      left: 14px;
      top: 14px;
      -webkit-animation-delay: 0.26s;
    }
    
    .loadEffect span:nth-child(3) {
      left: 50%;
      top: 0;
      margin-left: -8px;
      -webkit-animation-delay: 0.39s;
    }
    
    .loadEffect span:nth-child(4) {
      top: 14px;
      right: 14px;
      -webkit-animation-delay: 0.52s;
    }
    
    .loadEffect span:nth-child(5) {
      right: 0;
      top: 50%;
      margin-top: -8px;
      -webkit-animation-delay: 0.65s;
    }
    
    .loadEffect span:nth-child(6) {
      right: 14px;
      bottom: 14px;
      -webkit-animation-delay: 0.78s;
    }
    
    .loadEffect span:nth-child(7) {
      bottom: 0;
      left: 50%;
      margin-left: -8px;
      -webkit-animation-delay: 0.91s;
    }
    
    .loadEffect span:nth-child(8) {
      bottom: 14px;
      left: 14px;
      -webkit-animation-delay: 1.04s;
    }
    `
    const css = document.createElement('style')
    css.innerHTML = cssText
    document.querySelector('head').appendChild(css)
    document.querySelector(`#${this.id}`).append(div)
  }
  removeLoading () {
    document.querySelector(`#${this.id}`).innerHTML = ''
  }
}