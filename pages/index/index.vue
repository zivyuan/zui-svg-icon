<template>
  <view class="content">
    <swiper class="icon-swiper" :current="currentIcon" @change="onIconChange">
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
      <zui-svg-icon
        v-for="(icon, idx) in iconLib"
        :key="icon.key"
        :icon="icon.key"
        @tap="doChangeIcon(idx)"
      />
    </view>

    <view class="color-slider">
      <slider
        :value="huePosition"
        @changing="onColorChange"
        @change="onColorChange"
      />
      <view class="info">拖动换色</view>
      <view class="comment">示例只实现色相变换，灰色、黑白将看不到效果</view>
    </view>

    <view class="color-list">
      <view v-for="(color, idx) in currentColors" :key="idx" class="color-rect">
        <view class="color-name"
          ><text class="no">{{ idx + 1 }}.</text>{{ color }}</view
        >
        <view class="color-origin" :style="'--bg-color: ' + color"></view>
        <view
          class="color-changed"
          :style="'--bg-color: ' + mapedColors[idx]"
        ></view>
      </view>
    </view>

    <view class="img-icon-test">
      <view class="img-icon-gallery-title"
        >图票 URI 地址测试<text class="tips">(点击旋转)</text></view
      >
      <view class="img-icon-gallery">
        <view v-for="icon in imgIconLib" :key="icon.name" class="img-icon-item">
          <zui-svg-icon
            :icon="icon.img"
            :spin="spinIcon === icon.name && spinIconDur"
            :border-radius="borderRadius"
            @tap="doIconSpin(icon)"
          />
        </view>
      </view>
      <slider
        :value="borderRadius"
        @changing="onRadiusChange"
        @change="onRadiusChange"
      />
    </view>
  </view>
</template>

<script>
import zuiSvgIcon from "../../uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import IconLib from "@/static/svg-icons-lib.js";
import Color from "color";

const imgIconLib = [
  {
    name: "a-uniapp",
    img: require("../../static/svg-icons/a-uniapp.svg"),
  },
  {
    name: "b-google-play",
    img: require("../../static/svg-icons/b-google-play.svg"),
  },
  {
    name: "c-instagram",
    img: require("../../static/svg-icons/c-instagram.svg"),
  },
  {
    name: "chrome",
    img: require("../../static/svg-icons/chrome.svg"),
  },
  {
    name: "edge",
    img: require("../../static/svg-icons/edge.svg"),
  },
  {
    name: "firefox",
    img: require("../../static/svg-icons/firefox.svg"),
  },
  {
    name: "safari",
    img: require("../../static/svg-icons/safari.svg"),
  },
];

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
      imgIconLib,
      huePosition: 50,
      currentIcon: 1,
      //
      colorMpaed: [],
      spinIcon: "",
      spinIconDur: 0,

      borderRadius: undefined,
    };
  },

  computed: {
    currentColors() {
      const icon = this.iconLib[this.currentIcon];
      const colors = icon.icon
        .slice(1)
        .map((item) => IconLib.$_colorPalette[item]);

      return colors;
    },

    mapedColors() {
      const pos = (this.huePosition / 100) * 360 + 180;

      return this.currentColors.map((item) => {
        const c = Color(item).hsl();
        c.color[0] = (c.color[0] + pos) % 360;
        return c.rgb().toString();
      });
    },
  },

  onLoad() {},

  methods: {
    onColorChange(val) {
      this.huePosition = val.detail.value;
    },

    onIconChange(slider) {
      this.currentIcon = slider.detail.current;
    },

    doChangeIcon(idx) {
      this.huePosition = 50;
      this.currentIcon = idx;
    },

    doIconSpin(icon) {
      if (this.spinIcon !== icon.name) this.spinIconDur = 0;
      this.spinIcon = icon.name;

      if (this.spinIconDur) this.spinIconDur = 0;
      else this.spinIconDur = Math.random() > 0.5 ? 2 : -2;
    },

    onRadiusChange(slider) {
      const r = (slider.detail.value / 100) * 0.5;
      this.borderRadius = r < 0.05 ? undefined : r;
    },
  },
};
</script>

<style lang="scss">
.content {
  max-width: 828rpx;
  padding: 48rpx;
  margin: 0 auto;
}

.icon-swiper {
  height: 320rpx;
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
  background: #fafafa;
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
  margin-bottom: 72rpx;
  text-align: center;

  .info {
    color: #aaa;
    font-size: 28rpx;
    letter-spacing: 4rpx;
    line-height: 2em;
  }

  .comment {
    font-size: 24rpx;
    color: #aaa;
    opacity: 0.5;
    line-height: 1.6em;
  }

  ::v-deep {
    .uni-slider-thumb {
      border: 4rpx solid #fff;
      box-sizing: border-box;
    }
  }
}

.color-rect {
  display: flex;
  justify-content: flex-start;
  margin: 16rpx 0;

  .color-name {
    width: 100%;
    color: #888;
    margin-right: 0.5em;

    .no {
      width: 48rpx;
      display: inline-block;
      text-align: right;
      opacity: 0.5;
      margin-right: 8rpx;
    }
  }

  .color-origin,
  .color-changed {
    flex-shrink: 0;
    flex-grow: 0;
    width: 1em;
    height: 1em;
    border: 1px solid #eee;
    border-radius: 4rpx;
    background-color: var(--bg-color, #eee);
    margin-right: 1em;
  }
}

.img-icon-test {
  margin: 2em 0 3em;
}

.img-icon-gallery-title {
  margin-bottom: 0.4em;

  .tips {
    font-size: 0.8em;
    opacity: 0.5;
    margin-left: 0.4em;
  }
}

.img-icon-gallery {
  display: flex;
  margin-bottom: 2em;
}

.img-icon-item {
  font-size: 48rpx;
  margin-right: 0.5em;
}
</style>
