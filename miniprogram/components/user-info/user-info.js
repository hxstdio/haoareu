// components/user/user.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: { // TODO: MOCK数据
        name: '小夏来了',
        slogan: '英特纳雄奈尔，就一定要实现',
        photo: '../../images/author.jpeg',
        age: '80后',
        constellation: '天蝎座',
        work: '程序员',
        city: '武汉'
      }
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

  }
})
