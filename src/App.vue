<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
/*每个页面公共css */
page {
  background-image: url("https://uni.imgozi.cn/zui-svg-icon/static/bg.jpg");
  background-position: right top;
  background-size: auto 100vh;
  background-attachment: fixed;
}
uni-page-body {
  background-image: none;
}
</style>
