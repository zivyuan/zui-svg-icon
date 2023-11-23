# &lt;zui-svg-icon /&gt;

一款适用于 uni-app 的 SVG 图标组件。

**解决了 uni-app 在 APP 端中无法使用 SVG标签的问题**

- 支持单色、多色 SVG 图标换色；
- 支持图片 URI 地址；
- 支持 Base64 图片格式；
- 支持 spin 动画，可自定义旋转方向与速度；
- SVG 图片优化。



## 🍏 在线演示

**[💻 点我在浏览器里预览 https://uni.imgozi.cn/zui-svg-icon/](https://uni.imgozi.cn/zui-svg-icon/?utm_source=uni-plugin-market&utm_medium=readme&utm_campaign=zui-svg-icon&utm_id=uni-plugin)**

PS: 启动浏览器预览需要打开手机模器

**[📱 扫码体验](https://uni.imgozi.cn/zui-svg-icon/?utm_source=uni-plugin-market&utm_medium=readme&utm_campaign=zui-svg-icon&utm_id=uni-plugin)**

<img src="https://uni.imgozi.cn/zui-svg-icon/static/preview-qr.png" width="128" />



## 🍐 快速上手：

```html
<!-- 单色图标 -->
<zui-svg-icon icon="doc" color="#FF0000" />
<!-- 多色图标 -->
<zui-svg-icon icon="doc" :color="['#FF0000', '#00FF00', '#0000FF']" />
```

> 第一次运行或更新图标后需要手动运行一次图标生成脚本

自定义图标生成方法见下方说明

**除了自定义图标, 现在还可以使用图标库啦:** <span class="banner">
<span class="surport">
<a href="https://ext.dcloud.net.cn/plugin?id=15226" target="_blank" class="btn btn-support" style="border: 1px solid #ec4d4d;letter-spacing: 1px;">
  Material图标集合 图标组件 SVG 图标库
</a>
</span>
</span>

## 🍎 程序兼容性列表

| 兼容性 | 小程序 | 说明 |
| :---: | :--- | :--- |
| | 快应用 | ⚠️ 开发者账号注册太麻烦，不测了 |
| ✅ | 微信小程序 | 2023-09-04, zivyuan |
| ✅ | 支付宝小程序 | 2023-09-04, zivyuan |
| | 百度小程序 | ⚠️ 需要企业认证，无条件测试 |
| | 字节小程序 | ⚠️ 需要企业认证，无条件测试 |
| ✅ | QQ小程序 | 2023-09-04, zivyuan |
| ✅ | 钉钉小程序 | 2023-09-04, zivyuan |
| | 快手小程序 | ⚠️ 需要企业认证，无条件测试 |
| ✅ | 飞书小程序 | 2023-09-04, zivyuan |
| | 京东小程序 | ⚠️ 需要企业认证，无条件测试 |

☕🍻欢迎有兴趣的小伙伴一起完善小程序兼容性。🍻☕




## 🍊 参数

| 参数 | 类型 | 说明 |
|---|---|---|
| icon | string | 图标 id, 同图标文件名 |
|  | string | svg 源码字符串 *(不支持改色)* |
|  | string | 图片 URI *(不支持改色)* |
|  | string | Data URI *(不支持改色)* |
| color | string  | 单色图标颜色 |
|  | string[] | 多色图标颜色, 颜色种类必须与图标中的种类一致<br/>[了解多色图标👇🏻](#❤️‍🔥-多色图标) |
| width | string \| number | 图标宽度. 默认 1.2em. |
| height | undefined \| string \| number | 图标调试. 默认 undefined, 与高度一致. |
| gray | number | 灰度显示系数, [0, 1]. 默认为 0, 不开启 |
|  | boolean | 灰度显示系数. true => 1, false => 0 |
| spin | boolean | 是否启用 spin 动画。默认 false |
| | number | 动画时间。默认 5s，顺时针旋转；指定为负数时逆时针旋转；为 0 时禁用旋转效果，即 spin=false。 |
| borderRadius | number | 圆角数值，单位：像素。当输入值小于1当，作百分比处理 |
| | string | CSS 允许的值 |

> 说明:
>   当 icon 配置为 svg 源码字符串，图片URI，Data URI 时，图标不支持修改颜色

<span class="banner">
<span class="surport">
<a class="btn btn-support " data-toggle="modal" data-target="#support_modal" style="border: 1px solid #ec4d4d;letter-spacing: 1px;">
  🍓🍇🍉  喜欢就打赏一下  🍒🍑🥭
</a>
</span>
</span>



### 🍒 颜色锁定功能

在配置 color 时，将对应位置的颜色设置为空时，将保留原来的颜色。

『空值』是以下值中的任意一种：

`空字符串, null, undefined, false, 0`



## 🍑 事件

#### @click=(evt: Event) => void

#### @tap=(evt: Event) => void

组件针对小程序运行环境做了兼容处理，下表中列表已经做过兼容的小程序及映射的事件类型。

| 小程序 | @click | @tap  | @click & @tap |
| ------ | ------ | ----- | ------------- |
| H5     | Click  | Click | Click, Click  |
| 飞书   | Tap    | Tap   | Tap, Click    |
| QQ     | Tap    | Tap   | Tap, Click    |
| 钉钉   | Tap    | Tap   | Tap, Click    |
| 支付宝 | Tap    | Tap   | Tap, Click    |
| 微信   | Tap    | Tap   | Tap, Click    |

在 H5 环境下，如果同时指定 @click 和 @tap 事件，两个事件的触发顺序由书写顺序确定。

比如：`<zui-svg-icon @click @tap />` 是先触发 @click，再触发 @tap。

**PPPS：由于事件是兼容性处理，@click 和 @tap 事件里的 target 对象可能不一致，使用 target 时需要特别注意这个情况**





## 🍋 SVG 图标设计

### 🤍 单色图标

正常设计导出即可。



### ❤️‍🔥 多色图标

如果多色图标有改色需求，则在制作的时候需要人为控制颜色在SVG文件中出现的顺序，以确保图标的更新对代码的影响减至最小。

#### 为什么需要控制颜色的顺序

在SVG图像中，位于最底层的元素，其对应的节点描述最先出现在SVG文件里，这就决定了组件在获取颜色序列时，最底层元素的颜色始终第一位。

由于设计师在图标的设计、修改过程中，设计元素的层级顺序会变化，这将导致颜色顺序无法固定。每次修改图标都可能需要更新代码里的配色顺序。这个问题在有一系列图标时尤为明显。

#### 如何控制颜色顺序

在SVG图标最底层，人为设置一组元素，将图标里使用到的颜色逻列出来即可。

注意点：

1. 元素必须使用上层可见元素去遮挡，设置透明度为0会导致元素被优化掉从而失去；
2. 使用填充定义颜色，边框设置会被忽略；


## 🍋 SVG 图标管理

所有 svg 图标存放在项目的 `/static/svg-icons/` 文件夹中。

支持按文件夹进行分组整理，经过预处理后的图标名称为 `[文件夹名]-[文件名]`

如 chrome 图标存放于 `/browser/chrome.svg` ，则经过预处理后最终图标的名称为 `browser-chrome`



## 🍋 SVG 图标生成

使用专用脚本生成 SVG 图标库。



### 🥑 生成步骤

0. 安装依赖：`npm install svgo@latest --save-dev`
1. 添加运行脚本
   1. HBuilderX 项目：` "svgicon": "node ./uni_modules/zui-svg-icon/tools/generate-svg-icon.js"`
   2. cli 项目：` "svgicon": "node ./src/uni_modules/zui-svg-icon/tools/generate-svg-icon.js"`
2. 将 SVG 图标复制到 **图标保存位置**
   1. HBuilderX 项目：`/static/svg-icons`
   2. cli 项目：`/src/static/svg-icons`
3. 运行脚本 `npm run svgicon`
4. 结束！

脚本会生成图标库时会保持和目录里的图标一致。

生成脚本运行时会生成报告，显示图标的ID及状态（新增，修改与删除）。如果是多色图标还会显示对应的颜色序列。

```shell
Add    ppt
       [ '#f2733d', '#f3b2a6', '#fff' ]
Update xls
       [ '#47b347', '#e0efdc' ]
Total 2 svg icon(s) generated, 1 added, 0 deleted.
```




### 🍍 文件位置说明

#### SVG图标位置：

`/static/svg-icons/`

#### 脚本位置：

`/uni_modules/zui-svg-icon/tools/generate-svg-icon.js`

CLI 项目脚本位置:
`/src/uni_modules/zui-svg-icon/tools/generate-svg-icon.js`

#### 图标库位置：

`/static/svg-icons/svg-icons-lib.js`





## 🍓 支持

如果组件对您有帮助，请不吝打赏。肥宅快乐水🥤是创作动力！🥤🥤🥤

<span class="banner">
<span class="surport">
<a class="btn btn-support " data-toggle="modal" data-target="#support_modal" style="border: 1px solid #ec4d4d;letter-spacing: 1px;">
  🍓🍇🍉  喜欢就打赏一下  🍒🍑🥭
</a>
</span>
</span>
