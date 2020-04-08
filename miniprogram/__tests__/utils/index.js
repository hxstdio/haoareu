iimport * as utils from '../../utils/util.js';

describe('utils/util', () => {
  describe('mapingWatherToImage', () => {
    it('should mapingWatherToImage work correctly given valid parameters', () => {
      const weather = '暴雨';
      expect(utils.mapingWatherToImage(weather)).toEqual('/images/weather/rain.png');
    });

    it('should mapingWatherToImage work correctly given invalid parameters', () => {
      const weather = '无效的天气字符';
      expect(utils.mapingWatherToImage(weather)).toEqual('/images/weather/cloud.png');
    });
  });
});