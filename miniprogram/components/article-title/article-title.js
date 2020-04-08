import { mapingWatherToImage } from '../../utils/util.js';

const MONTH_EN_NAME = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
}

Component({
  properties: {
    desc: {
      type: String
    },
    weather: {
      type: String
    },
    date: {
      type: Number
    },
    temperature: {
      type: String
    }
  },

  data: {
    day: '',
    month: '',
    year: '',
    weatherIcon: '',
  },

  methods: {
  },

  observers: {
    'date': function (timestamp) {
      const dateObj = new Date(timestamp);
      const date = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      this.setData({
        day: date < 10 ? `0${date}` : `${date}`,
        month: month < 10 ? MONTH_EN_NAME[`0${month}`] : MONTH_EN_NAME[`${month}`],
        year: year,
      });
    },
    'weather': function(weather) {
      if(weather) {
        this.setData({
          weatherIcon: mapingWatherToImage(weather)
        });
      }
    }
  }
})
