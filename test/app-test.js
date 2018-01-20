'use strict';

import React from 'react';
import { mount } from 'enzyme';
import App from '../lib/views/index';
import expect from 'expect';
import mockData from './mockData';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

let mock = new MockAdapter(axios);

mock.onGet('/api/books').reply((config) => {
  if (config.params.pageIndex === 1) {
    return [200, mockData.page1];
  } else if (config.params.pageIndex === 2) {
    return [200, mockData.page2];
  }
});

describe('Checking App Rendering', () => {
  let app = mount(<App />);

  it('App is rendered', () => {
    expect(app.find('GoodReadsApp').length).toEqual(1);
  });

  it('Now rows are rendered', function () {
    expect(app.find('.table-row').length).toEqual(1);
    expect(app.find('.table-row').first().text()).toEqual('No Data Available');
  });
});

describe('Checking App Data Page Navigation', () => {
  let app = mount(<App />),
      input = app.find('SearchBox input'),
      button = app.find('SearchBox button');

  input.simulate('change', {
    target: {
      value: 'ender'
    }
  });

  button.simulate('click');

  before(() => {
    app.find('DataGrid .next-page').first().simulate('click');
  });

  it('Next Page rendered', () => {
    let tableRows = app.find('TableRow');

    expect(tableRows.length).toEqual(mockData.page2.books.length);
    expect(tableRows.find('td').length).toEqual(mockData.page2.books.length * 3);
    expect(tableRows.at(0).find('td').at(1).text()).toEqual(mockData.page2.books[0].title);
  });

  it('Previous Page rendered', function (done) {
    this.timeout(4000);
    app.find('DataGrid .prev-page').first().simulate('click');

    setTimeout(() => {
      let tableRows = app.find('TableRow');

      expect(tableRows.length).toEqual(mockData.page1.books.length);
      expect(tableRows.find('td').length).toEqual(mockData.page1.books.length * 3);
      expect(tableRows.at(0).find('td').at(1).text()).toEqual(mockData.page1.books[0].title);
      done();
    }, 2000);
  });
});
