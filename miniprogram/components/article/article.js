import { WEATHER_TYPES, MEDIA_TYPES } from '../../utils/constants.js';
import { requestCloud } from '../../utils/api.js';
const App = getApp();
const LIKE = '/images/like.png';
const UNLIKE = '/images/unlike.png';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    articleData: {
      type: Object,
      value: {}
    },
    isUseScrollView: {
      type: Boolean,
      value: false
    },
    isAutoResetHeight: {
      type: Boolean,
      value: false
    },
    isFullContainer: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    date: '',
    city: '',
    weather: '',
    mediaType: '',
    mediaUrl: '',
    content: '',
    temperature: '',
    isExtendBtnShow: false,
    animationObj: {},
    likeCount: 0,
  },

  attached: function () {
    this.animation = wx.createAnimation({
      duration: 100
    });
    const { city, content, fileId, title, type, weather, createdTime, temperature, likes } = this.properties.articleData;

    this.setData({
      date: createdTime,
      city,
      weather,
      temperature,
      mediaType: MEDIA_TYPES[type] || '',
      content: decodeURIComponent(content),
      likeIcon: UNLIKE,
      likeCount: likes,
    });

    wx.cloud.downloadFile({
      fileID: fileId,
      complete: res => {
        this.setData({
          mediaUrl: res.tempFilePath
        });
      }
    });
  },

  ready: function () {
    const query = this.createSelectorQuery();
    query.select('.content').boundingClientRect();
    query.exec((rect) => {
      if(rect && rect[0] && rect[0].height > 48){
        this.setData({
          isExtendBtnShow: true
        });
      }
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _setLike: function(id) {
      requestCloud({
        isShowLoading: false,
        name: 'add-like',
        data: {
          id
        },
      });
    },

    _showLikeAnimation: function() {
      this.animation.scale(2).step();
      this.animation.scale(1).step();
      this.setData({
        animationObj: this.animation.export(),
      });
    },

    onHandleExtend: function() {
      this.setData({
        isExtendBtnShow: false
      });
    },

    onHandleTapLike: function(event) {
      if (this.data.likeIcon === LIKE) {
        return;
      }

      this.setData({
        likeIcon: LIKE,
        likeCount: this.data.likeCount + 1
      });

      this._showLikeAnimation();
      this._setLike(event.currentTarget.dataset.id);
    },

    onHandlePreview: function() {
      wx.previewImage({
        urls: [this.data.mediaUrl],
      })
    },
  }
})
