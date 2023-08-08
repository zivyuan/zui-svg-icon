<template>
  <view class="zui-svg-icon" :style="style">
    <image
      class="zui-svg-icon-image"
      src="../../static/zui-svg-icon/zui-svg-icon-placeholder.svg"
      mode="aspectFill"
    ></image>
  </view>
</template>

<script>
import IconLib from "@/static/svg-icons-lib.js";

const regColorProps = /(?:fill|stroke)="([^"]+)"/g;

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
  },

  data() {
    return {
      isFilled: false,
    };
  },

  computed: {
    // 返回色彩列表
    multiColors() {
      const icon = IconLib[this.icon];
      let colors = [...icon.matchAll(regColorProps)]
        .filter((item) => item[1] !== "none")
        .map((item) => item[1]);
      colors = Array.from(new Set(colors));

      return colors;
    },

    style() {
      let icon = IconLib[this.icon];
      if (!icon)
        throw new Error(
          `Svg icon [${this.icon}] not defined and no fallback icon set.`
        );

      const width =
        typeof this.width === "number" ? `${this.width}px` : this.width;
      const style = {
        "--zui-svg-icon-width": width,
        "--zui-svg-icon-aspect-ratio": this.aspectRatio,
      };

      let svg = icon;
      if (this.multiColors.length > 1 && this.color) {
        const color =
          typeof this.color === "string" ? this.color.split(",") : this.color;
        if (color.length >= this.multiColors.length) {
          // 填充多色
          svg = icon.replace(regColorProps, (_, c) => {
            if (c === "none") return _;
            const idx = this.multiColors.findIndex((item) => item === c);
            return `fill="${color[idx]}"`;
          });
        } else {
          if (color.length < this.multiColors.length) {
            console.warn(
              `多色图标 ${this.icon} 需要 ${this.multiColors.length} 个颜色, 但只提供了 ${color.length}。`
            );
          }
        }
      } else if (/^#[0-9A-F]+$/i.test(this.color)) {
        svg = icon.replace(
                regColorProps,
                (_, v) => `fill="${v === "none" ? v : this.color}"`
              );
      }

      style[
        "--zui-svg-icon-image"
      ] = `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;

      // #ifdef MP

      return Object.keys(style).map(key => `${key}:${style[key]}`).join('; ')

      // #endif

      // #ifndef MP

      return style;

      // #endif
    },
  },
};
</script>

<style lang="scss" scoped>
.zui-svg-icon {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: var(--zui-svg-icon-aspect-ratio);
  width: var(--zui-svg-icon-width);
  height: calc(var(--zui-svg-icon-width) * var(--zui-svg-icon-aspect-ratio));
  line-height: 1;
  vertical-align: middle;
  margin: 0 0.2em;

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }

  .zui-svg-icon-image {
    width: 100%;
    height: 100%;
    background-image: var(--zui-svg-icon-image);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
