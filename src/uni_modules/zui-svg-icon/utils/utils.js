const _screenWidth = uni.getSystemInfoSync().screenWidth;
/**
 * rpx 单位转换为 px
 *
 * @param {number | string} rpx 待转换的数值
 * @returns number
 */
export const rpx2px = (rpx, unit = false) => {
  const px = (_screenWidth * Number.parseFloat(rpx)) / 750;
  return unit ? `${px}px` : px;
}
