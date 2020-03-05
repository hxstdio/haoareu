export const REQUEST_SUCCESS_STATUS = 'succ';
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const MEDIA_TYPES = ['video', 'image'];
export const WEATHER_TYPES = ['晴', '雨', '雪', '阴', '多云'];

export const MAX_VIDEO_DURATION = 30;

export const TOAST_DURATIONS = {
  SHORT: 1000,
  LONG: 2000
};

export const ERRORS = {
  FILE_TOO_LARGE: '文件太大了(超过5MB)',
  UPLOAD_FAIL: '上传出了点问题，稍候再试下吧',
  CHOOSE_FAIE_FAIL: '选择文件失败了呢，稍候再试下吧',
  CHOOSE_FAIE_CANNEL: 'chooseMedia:fail cancel',
  SUBMIT_SUCC: '提交成功',
  SUBMIT_FAIL: '提交失败，稍候再试下吧',
  GET_LOCATION_FAIL: '定位失败，稍候再试下吧',
  NO_POI_DATA: '你还没有足迹哦',
  GET_POI_LIST_FAIL: '你还没有足迹哦，去创建一个吧',
  NORMAL_ERROR: '出错了',
};

export const CENTER_CITY = {
  longitude: '108.909778',
  latitude: '34.335143',
};

export const AMAP_KEY = '44279efa675655cb19463b28ced69851';