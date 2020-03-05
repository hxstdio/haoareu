export const requestCloud = (params) => {
  const { name, data, success, fail, complete, loadingMsg, isShowLoading = true } = params;

  if (isShowLoading) {
    wx.showLoading({
      title: loadingMsg || '加载中...',
      mask: true,
    });
  }

  wx.cloud.callFunction({
    name,
    data,
    success,
    fail,
    complete: (res) => {
      if (isShowLoading) {
        wx.hideLoading();
      }

      complete && complete(res);
    },
  });
}