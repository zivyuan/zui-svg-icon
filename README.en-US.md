

# <zui-svg-icon />

An SVG icon component for uni-app.

**Solves the issue of SVG tags not working on uni-app's APP platform**

- Supports color changes for single-color and multi-color SVG icons;
- Supports image URI addresses;
- Supports Base64 image format;
- Supports spin animation, with customizable rotation direction and speed;
- SVG image optimization.



## 🍏 Online Demo

**[💻 Click here to preview in browser https://uni.imgozi.cn/zui-svg-icon/](https://uni.imgozi.cn/zui-svg-icon/?utm_source=uni-plugin-market&utm_medium=readme&utm_campaign=zui-svg-icon&utm_id=uni-plugin)**

PS: To preview in the browser, you need to open the mobile simulator.

**[📱 Scan QR to experience](https://uni.imgozi.cn/zui-svg-icon/?utm_source=uni-plugin-market&utm_medium=readme&utm_campaign=zui-svg-icon&utm_id=uni-plugin)**

<img src="https://uni.imgozi.cn/zui-svg-icon/static/preview-qr.png" width="128" />



## 🍐 Quick Start:

```html
<!-- Single-color icon -->
<zui-svg-icon icon="doc" color="#FF0000" />
<!-- Multi-color icon -->
<zui-svg-icon icon="doc" :color="['#FF0000', '#00FF00', '#0000FF']" />
```


## 🍎 Compatibility List

| Compatibility | Mini Program | Notes |
| :---: | :--- | :--- |
| | Quick App | ⚠️ Untested |
| ✅ | WeChat Mini Program | |
| ✅ | Alipay Mini Program | |
| | Baidu Mini Program | ⚠️ Untested |
| | ByteDance Mini Program | ⚠️ Untested |
| ✅ | QQ Mini Program | |
| ✅ | DingTalk Mini Program | |
| | Kuaishou Mini Program | ⚠️ Untested |
| ✅ | Feishu Mini Program | |
| | JD Mini Program | ⚠️ Untested |

☕🍻Feel free to help improve mini-program compatibility if you're interested. 🍻☕


## 🍊 Parameters

| Parameter | Type | Description |
|---|---|---|
| icon | string | Icon ID, same as the icon file name |
|  | string | SVG source code string *(color change not supported)* |
|  | string | Image URI *(color change not supported)* |
|  | string | Data URI *(color change not supported)* |
| color | string  | Single-color icon color |
|  | string[] | Multi-color icon colors, the number of colors must match the colors in the icon<br/>[Learn about multi-color icons 👇🏻](#️-多色图标) |
| width | string \| number | Icon width. Default: 1.2em. |
| height | string \| number | Icon height. Default: 1.2em. |
| gray | number | Grayscale display coefficient, [0, 1]. Default: 0 (disabled) |
|  | boolean | Grayscale display coefficient. true => 1, false => 0 |
| spin | boolean | Whether to enable spin animation. Default: false |
|  | number | Animation duration. Default: 5s (clockwise); negative values rotate counter-clockwise; 0 disables rotation (equivalent to spin=false). |
| borderRadius | number | Border radius value, in pixels. If the input value is less than 1, it is treated as a percentage. |
|  | string | Allowed CSS values |

> Note:
>   When icon is configured as an SVG source code string, image URI, or Data URI, the icon color cannot be changed.


### 🍒 Color Lock Feature

When configuring color, setting the corresponding position to an empty value will preserve the original color.

An 'empty value' refers to any of the following:

`` `'', null, undefined, false, 0` ``



## 🍑 Events

#### @click=(evt: Event) => void

#### @tap=(evt: Event) => void

The component has been adapted for mini-program environments. The table below lists the compatible mini-programs and their mapped event types.

| Mini Program | @click | @tap | @click & @tap |
| ------ | ------ | ----- | ------------- |
| H5 | Click | Click | Click, Click |
| Feishu | Tap | Tap | Tap, Click |
| QQ | Tap | Tap | Tap, Click |
| DingTalk | Tap | Tap | Tap, Click |
| Alipay | Tap | Tap | Tap, Click |
| WeChat | Tap | Tap | Tap, Click |

In the H5 environment, if both @click and @tap events are specified, the execution order of the two events is determined by their written order.

For example: `<zui-svg-icon @click @tap />` triggers @click first, then @tap.

**PPPS: Due to event compatibility handling, the target object inside @click and @tap events may differ. Please pay special attention to this when using target.**


## 🍋 SVG Icon Design

### 🤍 Single-Color Icons

Just design and export normally.



### ❤️‍🔥 Multi-Color Icons

If you need to change the colors of multi-color icons, you must manually control the order in which colors appear in the SVG file during creation. This ensures that icon updates have minimal impact on your code.

#### Why Control Color Order

In an SVG image, elements at the bottom layer have their node descriptions appear first in the SVG file. This means that when the component retrieves the color sequence, the bottom element's color is always first.

Since designers often change the layer order of design elements during icon creation and modification, the color order cannot be fixed. Every icon modification might require updating the color sequence in the code. This issue is particularly pronounced when working with a series of icons.

#### How to Control Color Order

At the very bottom layer of the SVG icon, manually add a set of elements to list all the colors used in the icon.

Notes:

1. Elements must be covered by upper visible elements. Setting opacity to 0 will cause the elements to be optimized away and lost.
2. Use fill to define colors; stroke/border settings will be ignored.


## 🍋 SVG Icon Management

All SVG icons should be placed in the project's `/assets/svg-icons/` folder.

Grouping by folders is supported. The processed icon name will be `[folder-name]-[file-name]`.

For example, if the chrome icon is located at `/browser/chrome.svg`, the final processed icon name will be `browser-chrome`.


## 🍋 SVG Icon Generation

Use a dedicated script to generate the SVG icon library.



### 🥑 Generation Steps

0. Install dependencies: `npm install svgo@latest --save-dev`
1. Add the run script: ` "svgicon": "node ./uni_modules/zui-svg-icon/tools/generate-svg-icon.js"`
   1. CLI project run script: ` "svgicon": "node ./src/uni_modules/zui-svg-icon/tools/generate-svg-icon.js"`
2. Copy SVG icons to the **icon save location**
3. Run the script `npm run svgicon`
4. Done!

The script generates the icon library, keeping it synchronized with the icons in the directory.

When the generation script runs, it produces a report showing the icon IDs and their statuses (added, modified, or deleted). For multi-color icons, the corresponding color sequence is also displayed.

```shell
Add    ppt
       [ '#f2733d', '#f3b2a6', '#fff' ]
Update xls
       [ '#47b347', '#e0efdc' ]
Total 2 svg icon(s) generated, 1 added, 0 deleted.
```



### 🍍 File Locations

#### SVG Icon Location:

`/assets/svg-icons/`

#### Script Location:

`/uni_modules/zui-svg-icon/tools/generate-svg-icon.js`

CLI project script location:
`/src/uni_modules/zui-svg-icon/tools/generate-svg-icon.js`

#### Icon Library Location:

`/static/svg-icons/svg-icons-lib.js`



## 🍓 Support

Treat me to a soda 🥤!
