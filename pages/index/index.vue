<template>
  <view class="content">
    <view class="container">
      <view v-for="icon in iconLib" :key="icon.key" class="icon-item">
        <view class="icon">
          <zui-svg-icon :icon="icon.key" />
        </view>
        <view class="title">{{ icon.key }}</view>
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
    const lib = Object.keys(IconLib)
      .map((key) => ({ key, icon: IconLib[key] }))
    return {
      iconLib: lib,
    };
  },

  onLoad() {},
  methods: {},
};
</script>

<style>
.container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 48rpx;
}
.icon-item {
  width: 25%;
  text-align: center;
  margin-bottom: 2em;
}

.icon {
  font-size: 80rpx;
}
</style>
