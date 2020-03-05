import { TOAST_DURATIONS, ERRORS } from '../../utils/constants.js';
import get from '../../utils/lodash.get.js';
import { requestCloud } from '../../utils/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onHandleInputComplete: function (event) {
    this._setMsg(event.detail.value);
  },

  onHandleInputPause: function (event) {
    this._setMsg(event.detail.value);
  },

  _setMsg: function (msg) {
    this.setData({
      msg: msg
    });
  },

  _showError: function() {
    wx.showToast({
      title: ERRORS.SUBMIT_FAIL,
      duration: TOAST_DURATIONS.LONG,
      icon: 'none'
    });
  },

  _getUserInfo: function(msg) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (ret) => {
              this._submitToServer(msg, get(ret, 'userInfo.nickName', ''), get(ret, 'userInfo.avatarUrl', ''));
            },
            fail: (err) => {
              this._showError();
            }
          })
        } else {
          this._submitToServer(msg, '', '');
        }
      },
      fail: err => {
        this._showError();
      }
    })
  },

  _submitToServer: function (msg, nick, avatarUrl) {
    requestCloud({
      loadingMsg: nick ? '正在提交...' : '正在匿名提交...',
      name: 'add-msg',
      data: {
        content: encodeURIComponent(msg),
        nick,
        avatarUrl,
      },
      success: res => {
        wx.showToast({
          title: ERRORS.SUBMIT_SUCC,
          duration: TOAST_DURATIONS.LONG,
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      },
      fail: err => {
        this._showError();
      }
    });
  },

  onHandleSubmit: function () {
    const { msg } = this.data;

    if (!msg) {
      wx.showToast({
        title: '不写点啥么...',
        duration: TOAST_DURATIONS.LONG,
        icon: 'none',
      })
      return;
    }

    this._getUserInfo(msg);
  },
})