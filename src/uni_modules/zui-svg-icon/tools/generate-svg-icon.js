#!/usr/bin/env node

/**
 * SVG 图标组件生成器
 *
 * 转换 SVG 图标为 inline 数据
 *
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline")
const cliInput = (prompt) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (ipt) => {
      resolve(ipt)
      rl.close()
    })
  })
}
const { optimize } = require("svgo");

const regFile = /\.svg$/i;
const regColorFormat = /#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})|(?:rgb|hsl|hwb|lab|lch|oklab|oklch)a?\([\d.,\/%]+\)/i;
const regCurrentColor = /([:"'] *)currentColor/g

const root = path.resolve(__dirname + "/../../..");
const svgo = root + "/svgo.config.js";
if (!fs.existsSync(svgo)) {
  fs.copyFileSync(__dirname + "/svgo.config.js", svgo);
}

// 需要处理的颜色属性
let svgBase = "";

if (fs.existsSync(root + "/src")) {
  svgBase = root + "/src/static";
} else {
  svgBase = root + "/static";
}
const svgFolder = svgBase + "/svg-icons";

if (!fs.existsSync(svgFolder)) {
  fs.mkdirSync(svgFolder, { recursive: true });
}
const svgLibFile = svgBase + "/svg-icons-lib.js";

const svgLibCurrent = (() => {
  try {
    let raw = fs.readFileSync(svgLibFile, { encoding: "utf-8" });
    raw = raw.substring(raw.indexOf("export default") + 15);
    return JSON.parse(raw);
  } catch (err) { }
  return {};
})();
const svgPath = path.resolve(svgFolder);
const svgLib = {};
const svgList = fs.readdirSync(svgPath).map(item => {
  if (!regFile.test(item)) return null;
  const name = item.slice(0, -4);
  const content = fs.readFileSync(svgPath + "/" + item).toString();

  return {
    name,
    content,
    hasCurrentColor: regCurrentColor.test(content)
  }
}).filter(item => !!item);

let palette = [];
let currentColor = svgLibCurrent.currentColor ? svgLibCurrent.currentColor : '';

(async () => {
  // 检测是否存在 currentColor
  const hasCurrentColor = svgList.find(item => item.hasCurrentColor)
  if (!currentColor && hasCurrentColor) {

    console.log("\n");
    console.log(
      "::>> 检测到 svg 文件中使用了 currentColor 变量，该变量在组件中不被支持。\n"
    );
    console.log("::>> 需要指定一个颜色替代，默认黑色为(#000)。\n");

    do {
      const color = await cliInput(`请输入颜色，直接回车(enter)使用默认值：`)
      if (color && color.length && !regColorFormat.test(color)) {
        console.log('\n::>> 颜色格式不正确，请输入以下格式的颜色值：\n')
        console.log('::>>', [
          '#000',
          '#000000',
          'rgb(0, 0, 0)',
          'rgba(0, 0, 0, 1)',
        ].join('   '), '\n')
      } else {
        currentColor = (color && color.length) ? color.replace(/ /g, '') : '#000'
      }

    } while (!currentColor)
  }

  svgList.forEach((item) => {
    const name = item.name
    // svgo 会过滤纯黑, 此处对纯黑做简单处理
    const svgContent = item.content.replace(regCurrentColor, `$1${currentColor}`).replace(/#0{3,8}/g, "#ZZZZZZ");
    const result = optimize(svgContent, {
      multipass: true,
    });
    result.data = result.data.replace(/#Z{3,8}/gi, "#000");
    svgLib[name] = result.data;

    const regColor = /(fill|stroke|stop-color):([^;}]+)/g;
    const parseColor = (colorStr) => {
      if (!regRef.test(colorStr)) {
        return colorStr;
      }
      // 从 Gradient 引用里获取颜色
      const match = colorStr.match(regRef);
      const ref = gradients.find((item) => {
        return item.id === match[1];
      });
      return ref ? ref.colors : [];
    };

    // Step 1, find all Gradient define and make KV map
    const regGradient = /<(\w+Gradient) id="([^"]+)" [^>]+>(.+?)<\/\1>/g;
    const regStopColors = /stop-color="([^"]+)"/g;
    const gradients = [...result.data.matchAll(regGradient)].map((item) => {
      const colors = [...item[3].matchAll(regStopColors)].map(
        (item) => item[1]
      );
      return {
        id: item[2],
        content: item[3],
        colors,
      };
    });

    // Step 2, find all class define and make KV map
    const regClass = /\.(cls-\d+)\{([^}]+)\}/g;
    const regRef = /url\(#(.+)\)/;
    const classes = [...result.data.matchAll(regClass)].map((item) => {
      // Search colors from item[2]
      // find fill, stroke, stop-color
      const colors = [...item[2].matchAll(regColor)].map((item) =>
        parseColor(item[2])
      );

      return {
        id: item[1],
        content: item[2],
        colors: colors,
      };
    });

    // Step 3, find all style, class, stroke property and search color in value
    const regProps = /(fill|stroke|class|style)="([^"]+)"/g;
    const props = [...result.data.matchAll(regProps)].map((content) => {
      let colors = [];
      if (content[1] === "class") {
        const item = classes.find((item) => item.id === content[2]);
        colors = item ? item.colors : [];
      } else if (content[1] === "style") {
        colors = [...content[2].matchAll(regColor)].map((item) =>
          parseColor(item[2])
        );
      } else if (content[1] === "fill") {
        colors = parseColor(content[2]);
      } else {
        colors = content[2];
      }
      return {
        prop: content[1],
        content: content[2],
        // 定义里的颜色
        colors: colors,
      };
    });

    // Step 4, filter
    let colors = props
      .map((item) => item.colors)
      .flat(2)
      .map(item => item === 'currentColor' ? currentColor : item)
      .filter((item) => item !== "none");
    colors = Array.from(new Set(colors));

    // Append new colors to palette
    palette = Array.from(new Set([...palette, ...colors]));

    // Build color index
    const colorMap = colors.map((c) => palette.indexOf(c));
    const colorTotal = colors.length;

    console.log(name);
    if (colorTotal === 0) {
      console.log("    ", "!!! 图标没有颜色定义, 将不支持改色. !!!");
    } else if (colorTotal > 0) {
      console.log("    ", JSON.stringify(colors));
    }

    svgLib[name] = [result.data, ...colorMap];
  });

  const data = {
    icons: JSON.parse(JSON.stringify(svgLib)),
    currentColor,
    $_colorPalette: palette,
  };

  const hasChange = JSON.stringify(svgLibCurrent) !== JSON.stringify(data);
  if (hasChange) {
    const script = [
      `/**
 *
 * Icon Library for <zui-svg-icon> usage
 *
 * Auto generated by /tools/svgicon.js
 *
 * !!! DO NOT MODIFY MANUALLY !!!
 *
 * @datetime ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
 *
 */`,
      "",
      "export default " + JSON.stringify(data, null, 2),
    ];
    fs.writeFileSync(svgLibFile, script.join("\n"));
    console.log(`\nTotal ${Object.keys(svgLib).length} svg icon(s) generated.`);
  } else {
    console.log(
      `\nTotal ${Object.keys(svgLib).length} svg icon(s) generated, nochange.`
    );
  }

  if (hasCurrentColor) {
    console.log('\n')
    console.log('  当前有使用到 currentColor 变量，可通过文件 static/svg-icons-lib.js 里的 currentColor 属性进行修改。')
    console.log('\n')
  }
})()
