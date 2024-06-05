#!/usr/bin/env node

/**
 * SVG 图标组件生成器
 *
 * 转换 SVG 图标为 inline 数据
 *
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const cliInput = prompt => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question(prompt, ipt => {
      resolve(ipt)
      rl.close()
    })
  })
}
const { optimize } = require('svgo')

const parseOptions = () => {
  const argv = process.argv.slice(2)
  const opts = {}
  argv.forEach(arg => {
    if (arg.indexOf('=') > -1) {
      const o = arg.split('=')
      opts[o[0]] = o[1]
    } else {
      opts[arg] = true
    }
  })
  return opts
}

const options = parseOptions()

const regColorFormat = /#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})|(?:rgb|hsl|hwb|lab|lch|oklab|oklch)a?\([\d.,\/%]+\)/i
const regCurrentColor = /([:"'] *)currentColor/g

const root = path.resolve(__dirname + '/../../..')
if (fs.existsSync(root + '/src')) {
  root = root + '/src'
}
const svgo = root + '/svgo.config.js'
if (!fs.existsSync(svgo)) {
  fs.copyFileSync(__dirname + '/svgo.config.js', svgo)
}

// 需要处理的颜色属性
let svgBase = root + '/assets'
const svgFolder = options.source || svgBase + '/svg-icons'

if (!fs.existsSync(svgFolder)) {
  fs.mkdirSync(svgFolder, { recursive: true })
}
const svgLibFile = root + `/static/${options.lib || 'svg-icons-lib'}.js`

const svgLibCurrent = (() => {
  try {
    let raw = fs.readFileSync(svgLibFile, { encoding: 'utf-8' })
    const start = raw.indexOf('const collections = {') + 20
    const end = raw.indexOf('// == collection end')
    raw = raw.substring(start, end).trim().replace(/;$/, '')
    return JSON.parse(raw).default
  } catch (err) {}
  return {}
})()
const svgPath = path.resolve(svgFolder)
const svgLib = {}
const svgList = (() => {
  const regFile = /\.svg$/i
  const fileList = []
  const loadSvgList = searchPath => {
    const files = fs.readdirSync(searchPath, { recursive: false })
    for (const file of files) {
      const filePath = path.posix.join(searchPath, file)
      const stat = fs.statSync(filePath)
      if (stat.isFile()) {
        if (!regFile.test(filePath)) continue

        const item = filePath.slice(filePath.lastIndexOf('svg-icons/') + 10)
        // const name = item.slice(0, -4).replace(/[/!@#$%^&*()+=\[\]{};:'",.<>\?`]/g, '-').toLowerCase()
        const name = item.slice(0, -4).replace(/[\/\\]/g, '-').toLowerCase()
        const content = fs.readFileSync(filePath, {
          encoding: 'utf-8',
        })
        fileList.push({
          name,
          content,
          hasCurrentColor: regCurrentColor.test(content),
          file: filePath,
        })
      }
      //
      else if (stat.isDirectory()) {
        loadSvgList(filePath)
      }
    }
    return fileList
  }

  return loadSvgList(svgPath).filter(item => !!item)
})(svgPath)

//
const defaultColor = '#22ac38'
let currentColor = svgLibCurrent.currentColor || ''
let palette = []

const generateIcon = svgRaw => {
  // svgo 会过滤纯黑, 此处对纯黑做简单处理
  svgRaw = svgRaw.replace(regCurrentColor, `$1${currentColor}`).replace(/#0{3,8}/g, '#ZZZZZZ')
  const result = optimize(svgRaw, {
    multipass: true,
  })
  result.data = result.data.replace(/#Z{3,8}/gi, '#000')

  const regColor = /(fill|stroke|stop-color):([^;}]+)/g
  const parseColor = colorStr => {
    if (!regRef.test(colorStr)) {
      return colorStr
    }
    // 从 Gradient 引用里获取颜色
    const match = colorStr.match(regRef)
    const ref = gradients.find(item => {
      return item.id === match[1]
    })
    return ref ? ref.colors : []
  }

  // Step 1, find all Gradient define and make KV map
  const regGradient = /<(\w+Gradient) id="([^"]+)" [^>]+>(.+?)<\/\1>/g
  const regStopColors = /stop-color="([^"]+)"/g
  const gradients = [...result.data.matchAll(regGradient)].map(item => {
    const colors = [...item[3].matchAll(regStopColors)].map(item => item[1])
    return {
      id: item[2],
      content: item[3],
      colors,
    }
  })

  // Step 2, find all class define and make KV map
  const regClass = /\.(cls-\d+)\{([^}]+)\}/g
  const regRef = /url\(#(.+)\)/
  const classes = [...result.data.matchAll(regClass)].map(item => {
    // Search colors from item[2]
    // find fill, stroke, stop-color
    const colors = [...item[2].matchAll(regColor)].map(item => parseColor(item[2]))

    return {
      id: item[1],
      content: item[2],
      colors: colors,
    }
  })

  // Step 3, find all style, class, stroke property and search color in value
  const regProps = /(fill|stroke|class|style)="([^"]+)"/g
  const props = [...result.data.matchAll(regProps)].map(content => {
    let colors = []
    if (content[1] === 'class') {
      const item = classes.find(item => item.id === content[2])
      colors = item ? item.colors : []
    } else if (content[1] === 'style') {
      colors = [...content[2].matchAll(regColor)].map(item => parseColor(item[2]))
    } else if (content[1] === 'fill') {
      colors = parseColor(content[2])
    } else {
      colors = content[2]
    }
    return {
      prop: content[1],
      content: content[2],
      // 定义里的颜色
      colors: colors,
    }
  })

  // Step 4, filter
  let colors = props
    .map(item => item.colors)
    .flat(2)
    .filter(item => item !== 'none' && !/^url/.test(item))
    .map(item => (item === 'currentColor' ? currentColor : item))
  colors = Array.from(new Set(colors))

  // Append new colors to palette
  palette = Array.from(new Set([...palette, ...colors]))

  // Build color index
  let colorMap = colors.map(c => palette.indexOf(c))
  const colorTotal = colors.length

  if (colorTotal === 0) {
    const fixable = /<(path|circle|ellipse|polygon|polyline|rect) /g
    if (fixable.test(result.data)) {
      return generateIcon(result.data.replace(fixable, `<$1 fill="${currentColor || defaultColor}" `))
    } else {
      console.log('  SVG 图片没有配置颜色, 并且无法进行预处理。请联系作者修复此问题。https://ext.dcloud.net.cn/plugin?id=13964')
    }
  } else if (colorTotal > 0) {
    console.log('    ', JSON.stringify(colors))
  }

  return [result.data, ...colorMap]
}

;(async () => {
  // 检测是否存在 currentColor
  const hasCurrentColor = svgList.find(item => item.hasCurrentColor)
  if (!currentColor && hasCurrentColor) {
    console.log('\n')
    console.log('::>> 检测到 svg 文件中使用了 currentColor 变量，该变量在组件中不被支持。\n')
    currentColor = defaultColor
    console.log(`::>> 需要指定一个颜色替代，默认黑色为(${currentColor})。\n`)

    do {
      const color = await cliInput(`请输入颜色，直接回车(enter)使用默认值：`)
      if (color && color.length && !regColorFormat.test(color)) {
        console.log('\n::>> 颜色格式不正确，请输入以下格式的颜色值：\n')
        console.log('::>>', ['#000', '#000000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)'].join('   '), '\n')
      } else {
        currentColor = color && color.length ? color.replace(/ /g, '') : defaultColor
      }
    } while (!currentColor)
  }

  svgList.forEach(item => {
    console.log(item.name)
    svgLib[item.name] = generateIcon(item.content)
  })

  const data = {
    icons: JSON.parse(JSON.stringify(svgLib)),
    currentColor,
    $_colorPalette: palette,
  }

  const hasChange = JSON.stringify(svgLibCurrent) !== JSON.stringify(data)
  if (hasChange) {
    const scriptTpl = fs.readFileSync(__dirname + '/svg-icons-lib.tpl.js', {
      encoding: 'utf-8',
    })
    const params = {
      datetime: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      default: JSON.stringify(data, null, 2).split('\n').join('\n  '),
    }
    const script = scriptTpl.replace(/__(\w+)__/g, (_, key) => {
      return params[key] || _
    })

    fs.writeFileSync(svgLibFile, script)
    console.log(`\nTotal ${Object.keys(svgLib).length} svg icon(s) generated.`)
  } else {
    console.log(`\nTotal ${Object.keys(svgLib).length} svg icon(s) generated, nochange.`)
  }

  if (hasCurrentColor) {
    console.log('\n')
    console.log('  当前有使用到 currentColor 变量，可通过文件 static/svg-icons-lib.js 里的 currentColor 属性进行修改。')
    console.log('\n')
  }
})()
