// components/photo/photo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      type: String,
    },
    autoResetHeight: {
      type: Boolean,
      value: true
    },
    desc: {
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    containerHeight: '375' , // TODO
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onHandleLoad(event) {
      this.setData({
        show: true,
      });

      if (this.properties.autoResetHeight) {
        const { width, height } = event.detail;
        this.setData({
          containerHeight: (750 * height) / width
        });
      }
    }
  }
})
