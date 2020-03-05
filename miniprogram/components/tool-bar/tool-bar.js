const App = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hide: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onHandleTap: function(event) {
      const { type } = event.currentTarget.dataset;
      const currentPages = getCurrentPages();
      const pageName = currentPages[currentPages.length - 1].route;

      if (pageName.indexOf(type) > -1) {
        return;
      }
      
      switch(type) {
        case 'blog' :
          wx.navigateTo({
            url: '/pages/blog/blog',
          })
          break;
        case 'foot':
          wx.navigateTo({
            url: '/pages/foot/foot',
          })
          break;
        case 'user': 
          wx.navigateTo({
            // url: App.globalData.isOwner ? '/pages/user/user' : '/pages/visitor/visitor',
            url: '/pages/visitor/visitor',
          })
          break;
        default :
          console.log('tool-bar error');
      }
    }
  }
})
