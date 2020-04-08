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
      date: 1586312567805,
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
  })
});