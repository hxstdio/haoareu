const ICON_TOTAL_AMOUNT = 17;

export const generateIconRandom = function() {
  const randomIndex = Math.floor(Math.random() * 100) % ICON_TOTAL_AMOUNT;
  return `/images/poi/${randomIndex}.png`;
}

export const mappingPoiIcon = function() {
  return '/images/poi/normal.png';
}

export const mapingWatherToImage = function(weather = '') {
  if (weather.indexOf('雨') > -1) {
    return '/images/weather/rain.png';
  }
  if (weather.indexOf('雪') > -1) {
    return '/images/weather/snow.png';
  }
  if (weather.indexOf('云') > -1) {
    return '/images/weather/cloud.png';
  }
  if (weather.indexOf('雷') > -1) {
    return '/images/weather/flash.png';
  }
  if (weather.indexOf('雾') > -1 || weather.indexOf('霾') > -1) {
    return '/images/weather/fog.png';
  }
  if (weather.indexOf('晴') > -1) {
    return '/images/weather/sun.png';
  }
  if (weather.indexOf('阴') > -1) {
    return '/images/weather/cloudy.png';
  }

  return '/images/weather/cloud.png';
}