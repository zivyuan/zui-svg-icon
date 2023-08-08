#!/usr/bin/env node

/**
 * SVG 图标组件生成器
 *
 * 转换 SVG 图标为 inline 数据
 *
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname + "/../../..");
const svgo = root + '/svgo.config.js'
if (!fs.existsSync(svgo)) {
  fs.copyFileSync(__dirname + '/svgo.config.js', svgo);
}

const { optimize } = require("svgo");


// 需要处理的颜色属性
const regColorProps = /(?:fill|stroke)="([^"]+)"/g;
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
  } catch (err) {}
  return {};
})();
const svgPath = path.resolve(svgFolder);
const svgLib = {};
const svgList = fs.readdirSync(svgPath);
const reg = /\.svg$/i;
let added = 0;
let hasChange = false;
svgList.forEach((item) => {
  if (!reg.test(item)) return;

  const name = item.slice(0, -4);
  const svgContent = fs.readFileSync(svgPath + "/" + item);
  const result = optimize(svgContent, {
    // optional but recommended field
    // path: 'path-to.svg',
    // all config fields are also available here
    multipass: true,
  });
  const updated = svgLibCurrent[name] !== result.data;
  svgLib[name] = result.data;

  if (svgLibCurrent[name]) {
    console.log(updated ? "Update" : "  Keep", name);
    delete svgLibCurrent[name];
  } else {
    console.log("   Add", name);
    added++;
  }
  let colors = [...result.data.matchAll(regColorProps)]
    .filter((item) => item[1] !== "none")
    .map((item) => item[1]);
  colors = Array.from(new Set(colors));
  const colorTotal = colors.at.length;
  if (colorTotal === 0) {
    console.log("      ", "!!! 图标没有颜色定义, 将不支持改色. !!!");
  } else if (colorTotal > 1) {
    console.log("      ", colors);
  }

  hasChange = hasChange || updated;
});

if (hasChange) {
  const script = [
    `/**
 *
 * Icon Library for <ks-svg-icon> usage
 *
 * Auto generated by /tools/svgicon.js
 *
 * !!! DO NOT MODIFY MANUALLY !!!
 *
 * @datetime ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
 *
 */`,
    "",
    "export default " + JSON.stringify(svgLib, null, 2),
  ];
  fs.writeFileSync(svgLibFile, script.join("\n"));
  const deleted = Object.keys(svgLibCurrent).map((item) =>
    console.log(`Delete ${item}`)
  ).length;
  console.log(
    `Total ${
      Object.keys(svgLib).length
    } svg icon(s) generated, ${added} added, ${deleted} deleted.`
  );
} else {
  console.log(
    `Total ${Object.keys(svgLib).length} svg icon(s) generated, nochange.`
  );
}
