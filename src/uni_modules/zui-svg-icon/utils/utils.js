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

/**
 * 验证输入的数据是否为合法的图片格式
 *
 * @param {string} svgRaw
 * @returns
 */
export const validRaw = (svgRaw) => {
  if (/^https?\:\/\//i.test(svgRaw)) return true
  if (/^data:image\//i.test(svgRaw)) return true
  if (/\.svg([?#].*)?$/i.test(svgRaw)) return true
  if (svgRaw.indexOf('/') > -1) return true

  return false
}
