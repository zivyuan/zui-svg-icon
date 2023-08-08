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
          <zui-svg-icon :icon="icon.key" />
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
    const lib = Object.keys(IconLib).map((key) => ({
      key,
      icon: IconLib[key],
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
  margin-right: -8px;
  margin-left: -8px;

  .zui-svg-icon {
    margin: 16rpx;
  }
}
</style>
