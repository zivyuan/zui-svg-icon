<template>
  <view class="zui-svg-icon">
    <view :class="clazz" :style="style">
      <!-- #ifndef H5 -->
      <view class="click-helper" @click="doClick" @tap="doTap"></view>
      <!-- #endif -->

      <image
        class="zui-svg-icon-image"
        :src="svgDataurl"
        mode="aspectFit"
      ></image>
    </view>
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

    /**
     * 圆角设置
     */
    borderRadius: [Number, String],
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
    /**
     * 是否文件来源
     */
    isFileSource() {
      return !/^[\w-]+$/.test(this.icon);
    },

    svgRaw() {
      if (this.isFileSource) return this.icon;

      const iconPreset = IconLib.icons[this.icon];
      if (!iconPreset) {
        console.warn(
          `Svg icon [${this.icon}] not defined and no fallback icon set.`
        );
        return;
      }
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
      const clazz = ["zui-svg-icon-wrapper"];
      if (this.spin && this.spin > 0) clazz.push("rotate-clockwise");
      if (this.spin && this.spin < 0) clazz.push("rotate-counterclockwise");
      // 必须转换成字符串, 不然 支付宝小程序 会以逗号连接类名导致错误
      return clazz.join(" ");
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

      if (this.borderRadius) {
        let br = this.borderRadius;
        if (typeof this.borderRadius === "string") {
          if (!/[^a-z%]/i.test(this.borderRadius)) {
            const v = parseFloat(this.borderRadius);
            if (v < 1) {
              br = `${v * 100}%`;
            } else {
              br = `${v}px`;
            }
          }
        } else {
          if (this.borderRadius < 1) {
            br = `${this.borderRadius * 100}%`;
          } else {
            br = `${this.borderRadius}px`;
          }
        }
        style["--zui-svg-icon-border-radius"] = br;
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

      return Object.keys(style)
        .map((key) => `${key}:${style[key]}`)
        .join("; ");
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
      // #ifdef MP-ALIPAY || MP-DINTTALK || MP-DINGDING
      this.$emit("tap", evt);
      // #endif
      setTimeout(() => {
        this.$emit("click", evt);
      }, 1)
    },

    doTap(evt) {
      setTimeout(() => {
        this.$emit("click", evt);
      }, 1)
    },

    initialIconSize() {
      // #ifndef H5
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".zui-svg-icon")
        .fields({ size: true })
        .exec((rst) => {
          if (!rst) return;
          if (!rst[0]) return;
          this.fixedHei = rst[0].width;
        });
      // #endif
    },

    initialIconColor() {
      // Initial color map
      const oriColors = this.getOriginalColors();
      if (this.color && oriColors.length) {
        const newColors =
          typeof this.color === "string" ? this.color.split(",") : this.color;
        this.colorPlaceholder = new RegExp(
          `(${oriColors
            .map((item) => item.replace(/([\(\)])/g, "\\$1"))
            .join("|")})([^\\w])`,
          "gi"
        );
        this.colorMap = oriColors.reduce((a, b, idx) => {
          return {
            ...a,
            [b.toLowerCase()]: newColors[idx] || oriColors[0],
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
  position: relative;
  display: inline-flex;
}
.zui-svg-icon-wrapper {
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
  border-radius: var(--zui-svg-icon-border-radius, 0);
  overflow: hidden;

  .zui-svg-icon-image {
    width: 100%;
    height: 100%;
    vertical-align: middle;
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
