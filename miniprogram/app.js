import { REQUEST_SUCCESS_STATUS } from './utils/constants.js';
import get from './utils/lodash.get.js';
import find from './utils/lodash.find.js';
import { requestCloud } from './utils/api.js';

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'release-6ldlc',
        traceUser: true,
      });
    }
    this.globalData = {
      openid: '',
      isOwner: false,
    };
    this.initConfig();
  },

  initConfig: function () {
    requestCloud({
      isShowLoading: false,
      name: 'init',
      data: {},
      complete: res => {
        if (res.result && res.result.status === REQUEST_SUCCESS_STATUS) {
          const openid = get(res, 'result.openid', '');
          const isOwner = get(res, 'result.isOwner', false);
          this.globalData.openid = openid;
          this.globalData.isOwner = isOwner;
        }
      }
    })
  }
})
