<template>
  <view class="zui-svg-icon">
    <view :class="clazz" :style="style">
      <!-- #ifndef H5 -->
      <view class="click-helper" @click="doClick" @tap="doTap"></view>
      <!-- #endif -->

      <image class="zui-svg-icon-image" :src="svgDataUrl" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script>
import { SvgIconLib } from '@/static/svg-icons-lib.js'
import { rpx2px, validRaw } from '../../utils/utils'

export default {
  name: 'zui-svg-icon',

  components: {},

  props: {
    icon: {
      type: String,
      default: undefined,
    },

    /**
     * svg 原始代码
     * base64 图片
     */
    raw: {
      type: String,
      default: undefined,
    },

    /**
     * 图标颜色
     *
     * 单色图标: '#FFF'
     *
     * 多色图标: ['#FFF', '#FFF', '#FFF'], 颜色数量需要匹配
     */
    color: [String, Array],

    width: {
      type: [Number, String],
      default: '1.2em',
    },

    height: {
      type: [Number, String],
      default: undefined,
    },

    /**
     * 图标灰度系数
     * boolean true =>  1
     * number => [0, 1]
     */
    gray: {
      type: [Boolean, Number],
      default: false,
    },

    /**
     * 图标旋转
     *
     * Boolean, true 旋转, 旋转一周时间 1s; false 不旋转, 默认值
     * Number, 旋转一周所需要时间. > 0 顺时针旋转; < 0 逆时针旋转;
     */
    spin: {
      type: [Number, Boolean],
      default: false,
    },

    /**
     * 圆角设置
     */
    borderRadius: [Number, String],

    /**
     * 图标集合
     */
    collection: {
      type: String,
      default: 'default',
    },

    /**
     * 宽高比
     * aspectRatio = width / height
     *
     * @deprecated  直接使用宽高设置尺寸
     *
     */
    aspectRatio: {
      type: Number,
      default: undefined,
    },
  },

  data() {
    return {
      isFilled: false,
      colorMap: {},
      colorPlaceholder: null,
      isColorCountMatch: true,
    }
  },

  computed: {
    cWidth() {
      const wid = /rpx$/i.test(this.width) ? rpx2px(this.width, true) : this.width
      return typeof wid === 'number' ? `${wid}px` : wid
    },

    cHeight() {
      if (!this.height) {
        if (this.aspectRatio) {
          const unit = `${this.cWidth}`.replace(/[\d.]+/g, '')
          const hei = parseFloat(this.cWidth) / this.aspectRatio

          return `${hei}${unit}`
        } else {
          return this.cWidth
        }
      }

      const hei = /rpx$/i.test(this.height) ? rpx2px(this.height, true) : this.height
      return typeof hei === 'number' ? `${hei}px` : hei
    },

    svgIconLib() {
      return SvgIconLib.getCollection(this.collection || 'default')
    },

    /**
     * 是否文件来源
     *
     * 包含 url, svg原始字符串, 未进行 base64 编码的 data:image/svg+xml uri
     */
    isFileSource() {
      return !!this.raw && validRaw(this.raw)
    },

    svgRaw() {
      if (validRaw(this.icon)) throw new Error('请使用 raw 属性设置 url 或 base64 格式的图标资源. 参考: https://ext.dcloud.net.cn/plugin?id=13964#zui-properties');

      const iconId = this.icon.toLowerCase()
      const iconPreset = this.svgIconLib.icons[iconId]
      if (!iconPreset) {
        console.warn(`图标 [${iconId}] 没有定义，请检查图标名称或使用 npm run svgicon 重新生成图标库.`)
        return
      }
      let svg = iconPreset[0]

      if (this.color && this.isColorCountMatch) {
        svg = svg.replace(this.colorPlaceholder, (_, a, b) => {
          return this.colorMap[a.toLowerCase()] + b
        })
      }

      return svg
    },

    svgDataUrl() {
      if (this.raw) {
        if (/^data:image\/svg\+xml,<svg/i.test(this.raw)) {
          return `data:image/svg+xml,${encodeURIComponent(this.raw.substring(19))}`
        } else if (/<svg/.test(this.raw)) {
          return `data:image/svg+xml,${encodeURIComponent(this.raw)}`
        } else {
          return this.raw;
        }
      }

      return `data:image/svg+xml,${encodeURIComponent(this.svgRaw)}`
    },

    clazz() {
      const clazz = ['zui-svg-icon-wrapper']
      if (this.spin && this.spin > 0) clazz.push('rotate-clockwise')
      if (this.spin && this.spin < 0) clazz.push('rotate-counterclockwise')
      // 必须转换成字符串, 不然 支付宝小程序 会以逗号连接类名导致错误
      return clazz.join(' ')
    },

    style() {
      const style = {
        '--zui-svg-icon-width': this.cWidth,
        '--zui-svg-icon-height': this.cHeight,
      }

      if (this.borderRadius) {
        let br = this.borderRadius
        if (typeof this.borderRadius === 'string') {
          if (!/[^a-z%]/i.test(this.borderRadius)) {
            const v = parseFloat(this.borderRadius)
            if (v < 1) {
              br = `${v * 100}%`
            } else {
              br = `${v}px`
            }
          }
        } else {
          if (this.borderRadius < 1) {
            br = `${this.borderRadius * 100}%`
          } else {
            br = `${this.borderRadius}px`
          }
        }
        style['--zui-svg-icon-border-radius'] = br
      }

      if (this.gray) {
        if (typeof this.gray === 'number') {
          style['filter'] = `grayscale(${this.gray})`
        } else {
          style['filter'] = 'grayscale(1)'
        }
      }

      if (this.spin) {
        const rotateDur = this.spin === true ? 5 : Math.abs(this.spin)
        style['--zui-svg-icon-rotate-duration'] = `${rotateDur}s`
      }

      return Object.keys(style)
        .map(key => `${key}:${style[key]}`)
        .join('; ')
    },
  },

  watch: {
    icon() {
      this.initialIcon()
    },
    color() {
      this.initialIconColor()
    },
  },

  created() {
    if (!this.icon && !this.raw) {
      throw new Error('要让 <zui-svg-icon /> 正常工作, icon 和 raw 属性必须指定其中一个.')
    }
  },

  mounted() {
    this.initialIcon()
  },

  methods: {
    doClick(evt) {
      // #ifdef MP-ALIPAY || MP-DINTTALK || MP-DINGDING
      this.$emit('tap', evt)
      // #endif
      setTimeout(() => {
        this.$emit('click', evt)
      }, 1)
    },

    doTap(evt) {
      setTimeout(() => {
        this.$emit('click', evt)
      }, 1)
    },

    initialIconColor() {
      // Initial color map
      const oriColors = this.getOriginalColors()
      if (this.color && oriColors.length) {
        const newColors = typeof this.color === 'string' ? this.color.split(',') : this.color
        this.colorPlaceholder = new RegExp(`(${oriColors.map(item => item.replace(/([\(\)])/g, '\\$1')).join('|')})([^\\w])`, 'gi')
        this.colorMap = oriColors.reduce((a, b, idx) => {
          return {
            ...a,
            [b.toLowerCase()]: newColors[idx] || oriColors[idx],
          }
        }, {})
        this.isColorCountMatch = oriColors.length === newColors.length
      } else {
        this.colorPlaceholder = null
        this.colorMap = null
        this.isColorCountMatch = true
      }
    },

    initialIcon() {
      this.initialIconColor()
    },

    getOriginalColors() {
      const iconPreset = this.svgIconLib.icons[this.icon]
      return iconPreset ? iconPreset.slice(1).map(idx => this.svgIconLib.$_colorPalette[idx]) : []
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes rotateClockwise {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
@keyframes rotateCounterclockwise {
  0% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(0);
  }
}
.zui-svg-icon {
  position: relative;
  display: inline-flex;
}
.zui-svg-icon-wrapper {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: var(--zui-svg-icon-width);
  height: var(--zui-svg-icon-height);
  line-height: 1;
  vertical-align: middle;
  border-radius: var(--zui-svg-icon-border-radius, 0);
  overflow: hidden;

  .zui-svg-icon-image {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }

  &.rotate-clockwise {
    animation: rotateClockwise var(--zui-svg-icon-rotate-duration, 5s) linear infinite;
  }
  &.rotate-counterclockwise {
    animation: rotateCounterclockwise var(--zui-svg-icon-rotate-duration, 5s) linear infinite;
  }
}

.click-helper {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
