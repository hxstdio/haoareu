import { requestCloud } from '../../utils/api.js';
import get from '../../utils/lodash.get.js';
const SCROLL_THRESHOLD = 150;

Page({
  animation: null,
  touchStartY: 0,

  /**
   * 页面的初始数据
   */
  data: {
    messages: [],
    animationObj: {},
    msgAnimationObj: {},
    isScrolled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    });
  },

  onShow: function() {
    this._loadMessage();
  },

  _loadMessage: function() {
    requestCloud({
      isShowLoading: false,
      name: 'get-msg-list',
      data: {},
      success: res => {
        this.setData({
          messages: get(res, 'result.originRet.data', []).map((msg) => {
            msg.nick = msg.nick || '一位不愿意透露姓名的热心网友'
            msg.content = decodeURIComponent(msg.content);
            msg.avatarUrl = msg.avatarUrl || '/images/noname.png';
            return msg;
          }),
        });
      },
    });
  },

  onHandleSwiper: function(isScrollToNextPage) {
    if (isScrollToNextPage) {
      this.setData({
        isScrolled: true,
      }, () => {
        this.animation.translateY('-105%').step();
        this.animation.translateY('-97%').step();
        this.animation.translateY('-100%').step();
        this.setData({
          animationObj: this.animation.export(),
        });
      });
    } else {
      this.animation.translateY('0').step();
      this.setData({
        animationObj: this.animation.export(),
      }, () => {
        setTimeout(() => {
          this.setData({
            isScrolled: false,
          });
        }, 500);
      });
    }
  },

  onHandleTouchStart: function(event) {
    if (this.data.isScrolled) {
      return;
    }

    this.touchStartY = event.touches[0].pageY;
  },

  onHandldTouchEnd: function(event) {
    if(this.data.isScrolled) {
      return;
    }

    const endPoint = event.changedTouches[0].pageY;
    if (this.touchStartY - endPoint > SCROLL_THRESHOLD) {
      this.onHandleSwiper(true);
    } else {
      this.touchStartY = 0;
    }
  },

  onHandleTapSwiper: function() {
    this.onHandleSwiper(true);
  },

  onHandleSwiperBack: function() {
    this.onHandleSwiper(false);
  },

  onHandleLeaveMsg: function() {
    wx.navigateTo({
      url: '/pages/message/message',
    });
  },
})