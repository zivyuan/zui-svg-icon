<template>
  <view :class="clazz" :style="style">
    <!-- #ifndef MP-WEIXIN || MP-LARK || MP-QQ -->
    <view v-if="useClick" class="click-helper" @click="doClick"></view>
    <view v-else class="click-helper" @tap="doTap"></view>
    <!-- #endif -->

    <!-- #ifdef MP-ALIPAY -->
    <!-- 支付宝小程序不支持背景方式显示SVG -->
    <image
      class="zui-svg-icon-image"
      :src="svgDataurl"
      mode="aspectFit"
    ></image>
    <!-- #endif -->
    <!-- #ifndef MP-ALIPAY -->
    <image
      class="zui-svg-icon-image"
      src="../../static/zui-svg-icon/zui-svg-icon-placeholder.svg"
      mode="aspectFit"
    ></image>
    <!-- #endif -->
  </view>
</template>

<script>
import IconLib from "@/static/svg-icons-lib.js";

const ThePalette = IconLib.$_colorPalette;

export default {
  name: "zui-svg-icon",

  components: {},

  props: {
    icon: {
      type: String,
      required: true,
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
      default: "1.2em",
    },

    aspectRatio: {
      type: Number,
      default: 1,
    },

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
  },

  data() {
    return {
      isFilled: false,
      fixedHei: 32,
      colorMap: {},
      colorPlaceholder: null,
      isColorCountMatch: true,
    };
  },

  computed: {
    useClick() {
      const evt = Object.keys(this.$listeners || {});
      return evt.includes("click");
    },
    // 返回色彩列表
    multiColors() {
      return this.colorIdx;
    },

    /**
     * 是否文件来源
     */
    isFileSource() {
      return !/^[\w-]+$/.test(this.icon);
    },

    svgRaw() {
      if (this.isFileSource) return this.icon;

      const iconPreset = IconLib.icons[this.icon];
      if (!iconPreset)
        throw new Error(
          `Svg icon [${this.icon}] not defined and no fallback icon set.`
        );
      let svg = iconPreset[0];

      if (this.color && this.isColorCountMatch) {
        svg = svg.replace(this.colorPlaceholder, (_, a, b) => {
          return this.colorMap[a.toLowerCase()] + b;
        });
      }

      return svg;
    },

    svgDataurl() {
      if (this.isFileSource) return this.icon;
      return `data:image/svg+xml,${encodeURIComponent(this.svgRaw)}`;
    },

    clazz() {
      const clazz = ["zui-svg-icon"]
      if (this.spin && this.spin > 0)
        clazz.push("rotate-clockwise")
      if (this.spin && this.spin < 0)
        clazz.push("rotate-counterclockwise")
      // 必须转换成字符串, 不然 支付宝小程序 会以逗号连接类名导致错误
      return clazz.join(' ');
    },

    style() {
      const width =
        typeof this.width === "number" ? `${this.width}px` : this.width;
      const style = {
        "--zui-svg-icon-width": width,
        "--zui-svg-icon-aspect-ratio": this.aspectRatio,
      };

      if (this.fixedHei) {
        style["--zui-svg-icon-height"] = `${
          this.fixedHei * this.aspectRatio
        }px`;
      }

      if (this.gray) {
        if (typeof this.gray === "number") {
          style["filter"] = `grayscale(${this.gray})`;
        } else {
          style["filter"] = "grayscale(1)";
        }
      }

      if (this.spin) {
        const rotateDur = this.spin === true ? 5 : Math.abs(this.spin);
        style["--zui-svg-icon-rotate-duration"] = `${rotateDur}s`;
      }

      // #ifndef MP-ALIPAY
      style["--zui-svg-icon-image"] = `url('${this.svgDataurl}')`;
      // #endif

      // #ifdef MP

      return Object.keys(style)
        .map((key) => `${key}:${style[key]}`)
        .join("; ");

      // #endif

      // #ifndef MP

      return style;

      // #endif
    },
  },

  watch: {
    icon() {
      this.initialIcon();
    },
    color() {
      this.initialIconColor();
    },
  },

  mounted() {
    this.initialIcon();
  },

  methods: {
    doClick(evt) {
      this.$emit("click", evt);
    },

    doTap(evt) {
      this.$emit("tap", evt);
    },

    initialIconSize() {
      // #ifndef H5
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".zui-svg-icon")
        .fields({ size: true })
        .exec((rst) => {
          if (!rst) return
          if (!rst[0]) return
          this.fixedHei = rst[0].width;
        });
      // #endif
    },

    initialIconColor() {
      // Initial color map
      const oriColors = this.getOriginalColors();
      if (this.color) {
        const newColors =
          typeof this.color === "string" ? this.color.split(",") : this.color;
        this.colorPlaceholder = new RegExp(
          `(${oriColors.map(item => item.replace(/([\(\)])/g, '\\$1')).join('|')})([^\\w])`,
          "gi"
        );
        this.colorMap = oriColors.reduce((a, b, idx) => {
          return {
            ...a,
            [b]: newColors[idx] || oriColors[0],
          };
        }, {});
        this.isColorCountMatch = oriColors.length === newColors.length;
      } else {
        this.colorPlaceholder = null;
        this.colorMap = null;
        this.isColorCountMatch = true;
      }
    },

    initialIcon() {
      this.initialIconSize();
      this.initialIconColor();
    },

    getOriginalColors() {
      const iconPreset = IconLib.icons[this.icon];
      return iconPreset
        ? iconPreset.slice(1).map((idx) => ThePalette[idx])
        : [];
    },
  },
};
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
  --zui-svg-icon-height-auto: calc(
    var(--zui-svg-icon-width) * var(--zui-svg-icon-aspect-ratio)
  );

  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: var(--zui-svg-icon-aspect-ratio);
  width: var(--zui-svg-icon-width);
  // #ifndef H5
  height: var(--zui-svg-icon-height, --zui-svg-icon-height-auto);
  // #endif
  line-height: 1;
  vertical-align: middle;

  .zui-svg-icon-image {
    width: 100%;
    height: 100%;
    background-image: var(--zui-svg-icon-image);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  &.rotate-clockwise {
    animation: rotateClockwise var(--zui-svg-icon-rotate-duration, 5s) linear
      infinite;
  }
  &.rotate-counterclockwise {
    animation: rotateCounterclockwise var(--zui-svg-icon-rotate-duration, 5s)
      linear infinite;
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
