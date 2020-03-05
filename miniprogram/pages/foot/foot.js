import get from '../../utils/lodash.get.js';
import { REQUEST_SUCCESS_STATUS, CENTER_CITY } from '../../utils/constants.js';
import { mappingPoiIcon } from '../../utils/util.js';
import { requestCloud } from '../../utils/api.js';
import { ERRORS } from '../../utils/constants.js';
const SEQUENCE_STEP_DURATION = 100;
const FAKE_CENTER_POI = [114.296129, 30.555534];

Page({
  cacheStorage: {},
  mapContext: null,

  data: {
    center: CENTER_CITY,
    scale: 4,
    markers: [],
    includePoints: [],
    animationObj: {},
    articleData: null,
    isError: false,
    errorMsg: ERRORS.NORMAL_ERROR,
  },

  onLoad: function (options) {
    this.mapContext = wx.createMapContext('myMap', this);
    this.loadData();
    this._initAnimation();
    this.cacheStorage = {};
  },

  _initAnimation: function () {
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });
  },

  _addPointToMarker: function (markers, coordinates, id, originId) {
    const longitude = coordinates[0];
    const latitude = coordinates[1];
    markers.push({
      originId,
      id,
      longitude,
      latitude,
      iconPath: mappingPoiIcon(),
      width: 32,
      height: 32,
      // label: {
      //   content: '测试一下',
      //   bgColor: '#FFFF00',
      // }
    });
  },

  _addPointToIncludePoints: function (includePoints, coordinates) {
    const longitude = coordinates[0];
    const latitude = coordinates[1];
    includePoints.push({
      longitude,
      latitude,
    });
  },

  _renderMarkerSequence: function(data, withAnimation) {
    const markers = [];
    const includePoints = [];

    data.forEach((item, index) => {
      this._addPointToMarker(markers, withAnimation ? FAKE_CENTER_POI : item.poi.coordinates, index, item._id);
      this._addPointToIncludePoints(includePoints, item.poi.coordinates);
    });

    this.setData({
      markers,
      includePoints
    }, () => {
      if (withAnimation) {
        const that = this;
        for (let i = 0, l = data.length; i < l; i++) {
          (function (index) {
            setTimeout(() => {
              that.mapContext.translateMarker({ 
                markerId: index,
                destination: {
                  longitude: data[index].poi.coordinates[0],
                  latitude: data[index].poi.coordinates[1],
                },
                autoRotate: false,
                duration: 300,
              });
            // }, SEQUENCE_STEP_DURATION);
          }, SEQUENCE_STEP_DURATION * index);
          })(i);
        }
      }
    });
  },

  _formatMarkerData: function (data) {
    const formatData = data.filter((el) => {
      return el.poi.coordinates[0] !== 0 && el.poi.coordinates[1] !== 0;
    }).sort((a, b) => {
      return a.createdTime < b.createdTime;
    });

    this._renderMarkerSequence(formatData, true);
  },

  _showError: function (msg) {
    this.setData({
      isError: true,
      errorMsg: msg
    });
  },

  _loadStorage: function (id) {
    return this.cacheStorage[id] || null;
  },

  _showDetailPanel: function() {
    this.animation.translateY('100%').step();
    this.setData({
      animationObj: this.animation.export(),
    });
  },

  loadData: function () {
    requestCloud({
      name: 'get-poi-list',
      data: {},
      success: res => {
        const status = get(res, 'result.status');
        const total = get(res, 'result.total', 0);

        if (status === REQUEST_SUCCESS_STATUS && total !== 0) {
          this._formatMarkerData(get(res, 'result.originRet.data', []));
        } else {
          this._showError(ERRORS.NO_POI_DATA);
        }
      },
      fail: err => {
        this._showError(ERRORS.GET_POI_LIST_FAIL);
      }
    });
  },

  loadDetail: function(id) {
    const cacheData = this._loadStorage(id);

    if(cacheData) {
      this.setData({
        articleData: cacheData
      });
      this._showDetailPanel();
      return;
    }

    requestCloud({
      name: 'get-poi-detail',
      data: {
        id
      },
      success: res => {
        const data = get(res, 'result.originRet.data', null);
        this.setData({
            articleData: data
        });
        this.cacheStorage[id] = data;
      },
      complete: () => {
        this._showDetailPanel();
      }
    });
  },

  onHandleMarkerTap: function (e) {
    this.loadDetail(this.data.markers[e.markerId].originId);
  },

  onHandleClose: function() {
    this.animation.translateY(0).step();
    this.setData({
      articleData: null,
      animationObj: this.animation.export(),
    });
  },
})