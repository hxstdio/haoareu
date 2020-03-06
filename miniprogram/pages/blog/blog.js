import { REQUEST_SUCCESS_STATUS } from '../../utils/constants.js';
import get from '../../utils/lodash.get.js';
import throttle from '../../utils/lodash.throttle.js';
import { requestCloud } from '../../utils/api.js';
const App = getApp();
const PAGE_SIZE = 2;
const FIRST_PAGE_NUM = 1;

Page({
  scrollTop: 0,
  isLoading: false,

  data: {
    isHideToolBar: false,
    noMoreResult: false,
    currentPageNum: FIRST_PAGE_NUM,
    list: [],
    isError: false,
  },

  onShow: function() {
    this.setData({
      currentPageNum: FIRST_PAGE_NUM,
    }, () => {
      this.loadData(FIRST_PAGE_NUM);
    });
  },

  loadData: function(pageNum) {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    requestCloud({
      name: 'list',
      data: {
        pageNum,
        pageSize: PAGE_SIZE,
      },
      complete: res => {
        this.isLoading = false;
        if (res.result && res.result.status === REQUEST_SUCCESS_STATUS) {
          const currentPageData = get(res, 'result.originRet.data', []);
          const totalPage = get(res, 'result.totalPage');
          const pageNum = get(res, 'result.pageNum');
          this.setData({
            list: pageNum === FIRST_PAGE_NUM ? currentPageData : [].concat(this.data.list, currentPageData),
            noMoreResult: pageNum === totalPage,
            currentPageNum: pageNum,
          });
        } else {
          if (pageNum === 1) {
            this.setData({
              isError: true
            });
          }
        }
      }
    }); 
  },

  onHandleScroll: throttle(function(event){
    const { scrollTop } = event.detail;
    this.setData({
      isHideToolBar: scrollTop - this.scrollTop > 0
    });
    this.scrollTop = scrollTop;
  }, 200),

  onHandleLoadMore: function() {
    if (!this.data.noMoreResult) {
      this.loadData(this.data.currentPageNum + 1)
    }
  },
})