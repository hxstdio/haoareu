import * as utils from '../../utils/util.js';

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

  describe('mappingPoiIcon', () => {
    it('should mappingPoiIcon work correctly given valid parameters', () => {
      expect(utils.mappingPoiIcon()).toEqual('/images/poi/normal.png');
    });
  });

  describe('generateIconRandom', () => {
    it('should generateIconRandom work correctly given valid parameters', () => {
      expect(utils.generateIconRandom().indexOf('/images/poi/') > -1).toBe(true)
    });
  });
});