<template>
  <view class="content">
    <swiper :current="currentIcon" @change="onIconChange">
      <swiper-item v-for="icon in iconLib" :key="icon.key" class="icon-item">
        <view class="icon">
          <zui-svg-icon :icon="icon.key" :color="mapedColors" />
        </view>
        <view class="title">
          <text class="icon-code">{{ icon.key }}</text>
        </view>
      </swiper-item>
    </swiper>

    <view class="icon-list">
      <zui-svg-icon v-for="(icon, idx) in iconLib" :key="icon.key" :icon="icon.key" @tap="doChangeIcon(idx)" />
    </view>

    <view class="color-slider">
      <slider
        :value="huePosition"
        @change="updateIconColor"
      />
      <text>拖动换色</text>
    </view>

    <view class="color-list">
      <view v-for="(color, idx) in currentColors" :key="idx" class="color-rect">
        <view class="color-name">{{ color }}</view>
        <view class="color-origin" :style="`--bg-color: ${color}`"></view>
        <view class="color-changed" :style="`--bg-color: ${mapedColors[idx]}`"></view>
      </view>
    </view>
  </view>
</template>

<script>
import zuiSvgIcon from "../../uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import IconLib from "@/static/svg-icons-lib.js";
import Color from 'color';

export default {
  components: {
    zuiSvgIcon,
  },

  data() {
    const lib = Object.keys(IconLib.icons).map((key) => ({
      key,
      icon: IconLib.icons[key],
    }));

    return {
      iconLib: lib,
      huePosition: 50,
      currentIcon: 0,
      //
      colorMpaed: [],
    };
  },

  computed: {
    currentColors() {
      const icon = this.iconLib[this.currentIcon]
      const colors = icon.icon.slice(1).map(item => IconLib.$_colorPalette[item])

      return colors
    },

    mapedColors() {
      const pos = this.huePosition / 100 * 360 + 180

      return this.currentColors.map(item => {
        const c = Color(item).hsl()
        c.color[0] = (c.color[0] + pos) % 360
        console.log('::>> ', item, ' .>> ', c.hsl())
        return c.toString()
      })
    }
  },

  onLoad() {},

  methods: {
    updateIconColor(val) {
      this.huePosition = val.detail.value
    },

    onIconChange(slider) {
      this.huePosition = 50
      this.currentIcon = slider.detail.current
    },

    doChangeIcon(idx) {
      this.currentIcon = idx
      console.log('change icon to', this.currentIcon)
    }
  },
};
</script>

<style lang="scss">
.content {
  padding: 48rpx;
}

.title {
  color: #999;
  font-size: 40rpx;
  text-align: center;
  line-height: 2em;
}

.icon-code {
  color: #333;
  font-weight: bold;
  margin: 0 0.25em;
}

.icon-item {
  height: 400rpx;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 180rpx;
  line-height: 1;
  width: 100%;
  height: 240rpx;
  line-height: 1;

  .zui-svg-icon {
    line-height: 1;
  }
}

.icon-list {
  font-size: 48rpx;
  margin-top: 48rpx;
  text-align: center;
  background: #FAFAFA;
  padding-bottom: 12rpx;
  border-radius: 52rpx;
  padding: 0.4em 0;
  line-height: 1;

  .zui-svg-icon {
    margin: 0 0.2em;
  }
}

.color-slider {
  margin-top: 48rpx;
  margin-bottom: 96rpx;
  text-align: center;
  color: #AAA;
  font-size: 28rpx;
  letter-spacing: 4rpx;
  line-height: 2em;
}

.color-rect {
  display: flex;
  justify-content: flex-start;
  margin: 16rpx 0;

  .color-name {
    min-width: 160rpx;
    color: #888;
  }

  .color-origin ,
  .color-changed {
    width: 1em;
    height: 1em;
    border: 1px solid #EEE;
    border-radius: 4rpx;
    background-color: var(--bg-color, #EEE);
    margin-right: 1em;
  }
}
</style>
