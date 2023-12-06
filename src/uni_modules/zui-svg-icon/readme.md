# &lt;zui-svg-icon /&gt;

一款适用于 uni-app 的 SVG 图标组件。

**解决了 uni-app 在 APP 端中无法使用 SVG标签的问题**

- 支持单色、多色 SVG 图标换色；
- 支持图片 URI 地址
- 支持 Base64 图片格式
- 支持 spin 动画，可自定义旋转方向与速度
- SVG 图片优化。
- 图标库支持



## 在线演示

**[💻 点我在浏览器里预览 https://uni.imgozi.cn/zui-svg-icon/](https://uni.imgozi.cn/zui-svg-icon/?utm_source=uni-plugin-market&utm_medium=readme&utm_campaign=zui-svg-icon&utm_id=uni-plugin)**

PS: 启动浏览器预览需要打开手机模器

**[📱 扫码体验](https://uni.imgozi.cn/zui-svg-icon/?utm_source=uni-plugin-market&utm_medium=readme&utm_campaign=zui-svg-icon&utm_id=uni-plugin)**

<img src="https://uni.imgozi.cn/zui-svg-icon/static/preview-qr.png" width="128" />



## 快速上手：

### 〇、生成图标库

```shell
npm rum svgicon
```

> 第一次使用请先参考下方 **图标库管理** 章节

### 一、使用

```vue
<!-- 单色图标 -->
<zui-svg-icon icon="doc" color="#FF0000" />
<!-- 多色图标 -->
<zui-svg-icon icon="doc" :color="['#FF0000', '#00FF00', '#0000FF']" />
```



## 图标库管理

图标库依赖 [svgo](https://www.npmjs.com/package/svgo) 插件对 svg 图标进行优化压缩，所以在所有工作开始前应该先安装 svgo 依赖。

> HBuilderX 项目和 cli 项目在路径上有所区别，请根据自己项目类型合理使用。



### 〇、安装必要依赖

```
npm i svgo@latest
```

如果最新版本在使用中出现异常，可以将 svgo 回退到插件开发环境使用的版本 `svgo@^3.0.5`。



### 一、配置 npm 脚本

在项目 `package.json` 中添加脚本。

HBuilderX 项目

```json
"svgicon": "node ./uni_modules/zui-svg-icon/tools/generate-svg-icon.js"
```

cli 项目

```json
"svgicon": "node ./src/uni_modules/zui-svg-icon/tools/generate-svg-icon.js"
```



### 二、准备图片

将 svg 图片复制到指定的目录

HBuilderX 项目

```shell
./static/svg-icons/
```

cli 项目

```shell
./src/static/svg-icons/
```

> 在 svg 目录中可以对图标按文件夹进行分组管理



### 三、生成图标库

运行图标库生成脚本

```shell
npm run svgicon
```

生成图标库时，图标名称会与svg 文件名保持一致。如果对图标库进行了分组管理，则图标名称前面会添加目录名称作为前缀。

例如：`browser/chrome-muti-color.svg` 生成后的图标名称为：`browser-chrome-muti-color`

建议图标名称只使用 **英文、数字和连接线** 的组合。

对于多色图标，生成工具会在生成报告中输出颜色序列，便于在项目中动态替换以实现图标换色功能。

生成报告示例：

```shell
Add    ppt
       [ '#f2733d', '#f3b2a6', '#fff' ]
Update xls
       [ '#47b347', '#e0efdc' ]
Total 2 svg icon(s) generated, 1 added, 0 deleted.
```

> **除了自定义图标，现在还可以使用现成的图标库，比如这个:** <span class="banner">
> <span class="surport">
> <a href="https://ext.dcloud.net.cn/plugin?id=15226" target="_blank" class="btn btn-support" style="border: 1px solid #ec4d4d;letter-spacing: 1px;">
>   Material图标集合 图标组件 SVG 图标库
> </a>
> </span>
> </span>

### 四、使用

```vue
<zui-svg-icon icon="my-icon" />
```

> 在新增 svg 图标或更新svg 图标后都需要按步骤三重新生成图标库

<span class="banner">
<span class="surport">
<a class="btn btn-support " data-toggle="modal" data-target="#support_modal" style="border: 1px solid #ec4d4d;letter-spacing: 1px;">
  🍓🍇🍉 好用就打赏一下  🍒🍑🥭
</a>
</span>
</span>



## 参数说明

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



## 事件

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


<span class="banner">
<span class="surport">
<a class="btn btn-support " data-toggle="modal" data-target="#support_modal" style="border: 1px solid #ec4d4d;letter-spacing: 1px;">
  🍓🍇🍉 好用就打赏一下  🍒🍑🥭
</a>
</span>
</span>



## 特色功能

### 颜色锁定

在配置 color 时，将对应位置的颜色设置为空时，将保留原来的颜色。

『空值』是以下值中的任意一种：

`空字符串, null, undefined, false, 0`



## 🍓 支持

如果组件对您有帮助，请不吝打赏。肥宅快乐水🥤是创作动力！🥤🥤🥤

<span class="banner">
<span class="surport">
<a class="btn btn-support " data-toggle="modal" data-target="#support_modal" style="border: 1px solid #ec4d4d;letter-spacing: 1px;">
  🍓🍇🍉 好用就打赏一下  🍒🍑🥭
</a>
</span>
</span>
