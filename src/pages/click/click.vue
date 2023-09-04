<template>
  <view class="click-test">
    <view class="row">
      <view class="label">@click</view>
      <view class="icon"
        ><zui-svg-icon icon="b-google-play" @click="doClick"></zui-svg-icon
      ></view>
    </view>
    <view class="row">
      <view class="label">@tap</view>
      <view class="icon"
        ><zui-svg-icon icon="b-google-play" @tap="doTap"></zui-svg-icon
      ></view>
    </view>
    <view class="row">
      <view class="label">@click & @tap</view>
      <view class="icon"
        ><zui-svg-icon
          icon="b-google-play"
          @click="doClick"
          @tap="doTap"
        ></zui-svg-icon
      ></view>
    </view>
    <view class="row">
      <view class="label">@tap & @click</view>
      <view class="icon"
        ><zui-svg-icon
          icon="b-google-play"
          @tap="doTap"
          @click="doClick"
        ></zui-svg-icon
      ></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'click',

  methods: {
    doClick(evt) {
      console.log("::>> doClick", evt);
    },

    doTap(evt) {
      console.log("::>> doTap", evt);
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: flex-start;
  font-size: 24px;
  margin: 1em;
}

.label {
  display: inline-block;
  width: 360rpx;
  margin-right: 0.5em;
  text-align: right;
}

.icon {
  display: inline-block;
}

</style>
