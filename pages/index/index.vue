<template>
  <view class="content">
    <view class="container">
      <view v-for="icon in iconLib" :key="icon.key" class="icon-item">
        <view class="title"
          >&lt;zui-svg-icon icon={{ '"'
          }}<text class="icon-code">{{ icon.key }}</text
          >{{ '"' }} /&gt;</view
        >
        <view class="icon">
          <zui-svg-icon :ref="`icon_${icon.key}`" :icon="icon.key" />
          <zui-svg-icon
            :icon="icon.key"
            :color="['#999', '#eaeaea', '#175e21']"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import zuiSvgIcon from "../../uni_modules/zui-svg-icon/components/zui-svg-icon/zui-svg-icon.vue";
import IconLib from "@/static/svg-icons-lib.js";

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
    };
  },

  onLoad() {},
  methods: {},
};
</script>

<style lang="scss">
.container {
  padding: 48rpx;
}

.title {
  color: #999;
}

.icon-code {
  color: #333;
  font-weight: bold;
  margin: 0 0.25em;
}

.icon-item {
  margin-bottom: 2em;
}

.icon {
  display: flex;
  justify-content: flex-start;
  font-size: 80rpx;
  margin-right: -16rpx;
  margin-left: -16rpx;
  line-height: 1;

  .zui-svg-icon {
    margin: 0 16rpx;
  }
}
</style>
