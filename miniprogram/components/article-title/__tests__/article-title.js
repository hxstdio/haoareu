const simulate = require('miniprogram-simulate');
const path = require('path')

describe('components/article-title/article-title', () => {
  let id;

  beforeAll(() => {
    // id = simulate.load('/components/article-title/article-title');
    id = simulate.load(path.join(process.cwd(), './components/article-title/article-title'));
  });

  it('should components init correctly given valid props', () => {
    const props = {
      desc: 'desc',
      weather: '雨',
      date: new Date('2020-04-08').getTime(),
      temperature: '30',
    };  
    
    const comp = simulate.render(id, props);
    const parent = document.createElement('parent-wrapper');
    comp.attach(parent);
    const dayView = comp.querySelector('.day');
    const monthView = comp.querySelector('.month');
    const descViews = comp.querySelector('.desc');

    expect(dayView.dom.innerHTML).toBe('08');
    expect(monthView.dom.innerHTML).toBe('Apr. 2020');
    expect(descViews.dom.innerHTML).toBe(props.desc);
  });

  it('should components display date correctly given the day/month of date < 10 in props', () => {
    const props = {
      date: new Date('2020-09-09').getTime(),
    };

    const comp = simulate.render(id, props);
    const parent = document.createElement('parent-wrapper');
    comp.attach(parent);
    const dayView = comp.querySelector('.day');
    const monthView = comp.querySelector('.month');

    expect(dayView.dom.innerHTML).toBe('09');
    expect(monthView.dom.innerHTML).toBe('Sep. 2020');
  });

  it('should components display date correctly given the day/month of date >= 10 in props', () => {
    const props = {
      date: new Date('2020-10-10').getTime(),
    };

    const comp = simulate.render(id, props);
    const parent = document.createElement('parent-wrapper');
    comp.attach(parent);
    const dayView = comp.querySelector('.day');
    const monthView = comp.querySelector('.month');

    expect(dayView.dom.innerHTML).toBe('10');
    expect(monthView.dom.innerHTML).toBe('Oct. 2020');
  });

  it('should components hide weatherIcon without given weather in props', () => {
    const props = {
      desc: 'desc',
      date: 1586312567805,
      temperature: '30',
    }; 

    const comp = simulate.render(id, props);
    const parent = document.createElement('parent-wrapper');
    comp.attach(parent);
    const weatherIcon = comp.querySelector('.weather-icon');

    expect(weatherIcon).toBeUndefined();
  });

  it('should components hide temperature without given temperature in props', () => {
    const props = {
      desc: 'desc',
      date: 1586312567805,
    };

    const comp = simulate.render(id, props);
    const parent = document.createElement('parent-wrapper');
    comp.attach(parent);
    const temperatureView = comp.querySelector('.temperature');

    expect(temperatureView).toBeUndefined();
  });

  it('should components hide temperature without given desc/weather/temperature in props', () => {
    const props = {
      date: 1586312567805,
    };

    const comp = simulate.render(id, props);
    const parent = document.createElement('parent-wrapper');
    comp.attach(parent);
    const temperatureView = comp.querySelector('.temperature');
    const weatherIcon = comp.querySelector('.weather-icon');
    const descViews = comp.querySelector('.desc');

    expect(temperatureView).toBeUndefined();
    expect(weatherIcon).toBeUndefined();
    expect(descViews).toBeUndefined();
  });
});