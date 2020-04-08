import '../../pages/visitor/visitor';

const page = global.wxPageInstance;

describe('pages/visitor/visitor', () => {
  describe('onLoad', () => {
    beforeAll(() => {
      page.onLoad();
    });

    it('should animation init correctly', () => {
      expect(wx.createAnimation).toBeCalledWith({
        duration: 500,
        timingFunction: 'ease-in-out',
      });
      expect(page.animation).not.toBeNull();
    });
  });

  describe('onShow', () => {
    beforeAll(() => {
      jest.spyOn(page, '_loadMessage');
      page.onShow();
    });

    it('should _loadMessage be called while onShow', () => {
      expect(page._loadMessage).toBeCalled();
    });
  });
});