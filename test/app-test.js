'use strict';

import React from 'react';
import { mount } from 'enzyme';
import App from '../lib/views/index';
import expect from 'expect';
import mockData from './mockData';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

let mock = new MockAdapter(axios);

mock.onGet('https://api.iextrading.com/1.0/stock/ATHN/chart/1m').reply(() => {
  return [200, mockData.stock];
});

mock.onGet('https://api.iextrading.com/1.0/ref-data/symbols').reply(() => {
  return [200, mockData.companies];
});

describe('Checking App Rendering', function () {
  let app = mount(<App />);
  this.timeout(10000);

  it('App is rendered', () => {
    expect(app.find('App').length).toEqual(1);
  });

  it('Athena is selected as the default company symbol', () => {
    expect(app.find('Select').first().prop('value')).toEqual('ATHN');
  });

  it('Opening and Closing Areas alone are rendered on the chart', () => {
    expect(app.state().showOpening).toEqual(true);
    expect(app.state().showClosing).toEqual(true);
    expect(app.state().showHighest).toEqual(false);
    expect(app.state().showLowest).toEqual(false);
  });

  it('Opening, Closing and Highest Areas are rendered on the chart, when "Show Highest" is enabled', () => {

    app.find('.toolbox input').at(2).simulate('change', {
      target: {
        name: 'showHighest',
        checked: true
      }
    });

    expect(app.state().showOpening).toEqual(true);
    expect(app.state().showClosing).toEqual(true);
    expect(app.state().showHighest).toEqual(true);
    expect(app.state().showLowest).toEqual(false);
  });

  it('Opening, Closing and Highest Areas are rendered on the chart, when "Show Highest" is enabled', () => {

    app.find('.toolbox input').at(2).simulate('change', {
      target: {
        name: 'showHighest',
        checked: true
      }
    });
    app.find('.toolbox input').at(2).simulate('change', {
      target: {
        name: 'showLowest',
        checked: true
      }
    });

    expect(app.state().showOpening).toEqual(true);
    expect(app.state().showClosing).toEqual(true);
    expect(app.state().showHighest).toEqual(true);
    expect(app.state().showLowest).toEqual(true);
  });

  it('Checking symbol fetch error scenario', (done) => {
    app.unmount();
    mock.reset();
    mock.onGet('https://api.iextrading.com/1.0/ref-data/symbols').reply(() => {
      return [500];
    });
    app.mount();

    setTimeout(() => {
      expect(app.state().error).toEqual(true);
      done();
    }, 2000);
  });

  it('Checking stock data fetch error scenario', (done) => {
    app.unmount();
    mock.reset();
    mock.onGet('https://api.iextrading.com/1.0/ref-data/symbols').reply(() => {
      return [200, mockData.companies];
    });
    mock.onGet('https://api.iextrading.com/1.0/stock/ATHN/chart/1m').reply(() => {
      return [500];
    });
    app.mount();

    setTimeout(() => {
      expect(app.state().error).toEqual(true);
      done();
    }, 2000);
  });
});

// describe('Checking error scenarios', () => {
//   mock.reset();
//   mock.onGet('https://api.iextrading.com/1.0/stock/ATHN/chart/1m').reply(() => {
//     return [500];
//   });

//   mock.onGet('https://api.iextrading.com/1.0/ref-data/symbols').reply(() => {
//     return [500];
//   });
// });
