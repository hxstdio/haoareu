import { MAX_FILE_SIZE, MEDIA_TYPES, TOAST_DURATIONS, ERRORS, MAX_VIDEO_DURATION, WEATHER_TYPES, AMAP_KEY } from '../../utils/constants.js';
import find from '../../utils/lodash.find.js';
import get from '../../utils/lodash.get.js';
import { requestCloud } from '../../utils/api.js';
import { mapingWatherToImage } from '../../utils/util.js';
const App = getApp();
const AmapFile = require('../../libs/amap-wx.js');

Page({
  data: {
    mediaUrl: '',
    mediaType: '',
    fileId: '',
    msg: '',
    city: '',
    weather: '',
    weatherIcon: '',
    temperature: '',
    longitude: 0,
    latitude: 0,
    isGetLocation: false,
    isPoi: false,
    locationAnimObj: {},
  },

  _setMsg: function (msg) {
    this.setData({
      msg: msg
    });
  },

  _getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        const { longitude, latitude } = res;
        this.setData({
          isGetLocation: true,
          longitude,
          latitude,
        });

        this._getCityByLocation();
        this._getWeatherByLocation();
      },
      fail: err => {
        wx.showToast({
          title: ERRORS.GET_LOCATION_FAIL,
          duration: TOAST_DURATIONS.LONG,
          icon: 'none'
        });
        this.setData({
          isGetLocation: false
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  _getAuthSetting: function () {
    wx.showLoading({
      title: '获取定位...',
      mask: true,
    });

    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this._getLocation();
            },
            fail: err => {
              console.log('authorize [scope.userLocation] fail', err);
              wx.hideLoading();
              this.setData({
                isGetLocation: false
              });
            },
          })
        } else {
          this._getLocation();
        }
      },
      fail: err => {
        console.log('getSetting fail', err);
        wx.hideLoading();
        this.setData({
          isGetLocation: false
        });
      }
    })
  },

  _getCityByLocation: function() {
    if (!this.myAmapFun) {
      this._initAmap();  
    }

    this.myAmapFun.getRegeo({
      success: (res = []) => {
        if (res.length) {
          const city = get(res[0], 'regeocodeData.addressComponent.city', '');
          this.setData({
            city
          });
        }
      },
      fail: err => {
        console.log('_getCityByLocation', err);
      },
    });
  },

  _getWeatherByLocation: function () {
    if (!this.myAmapFun) {
      this._initAmap();
    }

    this.myAmapFun.getWeather({
      type: 'live',
      success: (res) => {
        const weather = get(res, 'liveData.weather', '');
        const temperature = get(res, 'liveData.temperature', '');
        this.setData({
          weather,
          temperature,
          weatherIcon: mapingWatherToImage(weather),
        });
      },
      fail: err => {
        console.log('_getWeatherByLocation', err);
      }
    });
  },

  _initAmap: function () {
    this.myAmapFun = new AmapFile.AMapWX({ key: AMAP_KEY });
  },

  onLoad: function (options) {
    this._initAmap();
    this.animation = wx.createAnimation({
      duration: 100
    });
  },

  onUnload: function() {
    this.myAmapFun = null;
  },

  onHandleInputComplete: function (event) {
    this._setMsg(event.detail.value);
  },

  onHandleInputPause: function (event) {
    this._setMsg(event.detail.value);
  },

  onHandleSetSelfOnly: function (event) {
    this.setData({
      isPoi: !event.currentTarget.dataset.value,
    });
  },

  onHandleGetLocation: function (event) {
    if (!event.currentTarget.dataset.value) {
      this._getAuthSetting();
    } else {
      this.setData({
        isGetLocation: false,
      });
    }
  },

  onHandleUpload: function () {
    wx.chooseMedia({
      count: 1,
      mediaType: MEDIA_TYPES,
      sourceType: ['album'],
      maxDuration: MAX_VIDEO_DURATION,
      success: res => {
        wx.showLoading({
          title: '上传中...',
        });

        const fileInfo = res.tempFiles[0] || {};
        const mediaType = res.type;
        if (!fileInfo.size || !fileInfo.tempFilePath || fileInfo.size > MAX_FILE_SIZE) {
          wx.showToast({
            title: ERRORS.FILE_TOO_LARGE,
            duration: TOAST_DURATIONS.LONG,
            icon: 'none'
          });
          return;
        }

        const filePath = fileInfo.tempFilePath;
        const cloudPath = `${App.globalData.openid}/${new Date().getTime()}${filePath.match(/\.[^.]+?$/)[0]}`; 

        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            this.setData({
              fileId: res.fileID,
              mediaUrl: filePath,
              mediaType
            });
          },
          fail: err => {
            console.log('uploadFile fail', err);
            wx.showToast({
              title: ERRORS.UPLOAD_FAIL,
              duration: TOAST_DURATIONS.LONG,
              icon: 'none'
            });
          },
          complete: () => {
            wx.hideLoading();
          }
        });
      },
      fail: function(err) {
        if(err.errMsg !== ERRORS.CHOOSE_FAIE_CANNEL) {
          wx.showToast({
            title: ERRORS.CHOOSE_FAIE_FAIL,
            duration: TOAST_DURATIONS.LONG,
            icon: 'none'
          });
        }
      }
    })
  },

  onHandleSubmit: function () {
    const { msg, fileId, mediaType, longitude, latitude, isPoi, city, weather, temperature } = this.data;

    if (!fileId) {
      wx.showToast({
        title: '请先选择一张图片/视频',
        duration: TOAST_DURATIONS.LONG,
        icon: 'none',
      })
      return;
    }

    requestCloud({
      loadingMsg: '正在提交...',
      name: 'add-article',
      data: {
        city,
        weather,
        temperature,
        content: encodeURIComponent(msg),
        fileId,
        longitude,
        latitude,
        title: '',
        isPoi,
        type: MEDIA_TYPES.indexOf(mediaType)
      },
      success: res => {
        wx.showToast({
          title: ERRORS.SUBMIT_SUCC,
          duration: TOAST_DURATIONS.LONG,
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      },
      fail: err => {
        wx.showToast({
          title: ERRORS.SUBMIT_FAIL,
          duration: TOAST_DURATIONS.LONG,
          icon: 'none'
        });
      }
    });
  },

  onHandleWeatherIconLoad: function() {
    this.animation.translateX('-100%').step();
    this.setData({
      locationAnimObj: this.animation.export(),
    });
  },
})