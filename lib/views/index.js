'use strict';

import React from 'react';
import * as dataRequests from '../dataRequests';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Select from 'react-select';
import classnames from 'classnames';

/**
 * This react component provides the layout of the application
 * @class
 */
class App extends React.Component {
  /* istanbul ignore next */
  /**
   * Creates an instance of App.
   * @memberof App
   */
  constructor () {
    super();
    this.state = {
      data: [],
      symbols: [],
      selectedCompany: 'ATHN',
      showOpening: true,
      showClosing: true,
      showHighest: false,
      showLowest: false,
      containerWidth: null,
      isLoading: true,
      error: false
    };
    this.handleInputChange = (e) => this._handleInputChange(e);
    // this.fitParentContainer = () => this._fitParentContainer();
    this.handleCompanyChange = (selectedOption) => this._handleCompanyChange(selectedOption);
  }

  /**
   * Fetches the stock details of the selected company
   *
   * @memberof App
   * @returns {undefined}
   */
  fetchStockDetails () {
    let date = new Date(),
        storageKey = `${this.state.selectedCompany}::${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (localStorage[storageKey] !== undefined) {
      let stock = JSON.parse(localStorage[storageKey]);

      this.setState({
        data: stock,
        isLoading: false
      });

    } else {
      this.setState({
        isLoading: true,
        data: []
      }, () => {
        dataRequests.getStock(this.state.selectedCompany)
          .then((stock) => {
            localStorage[storageKey] = JSON.stringify(stock);

            this.setState({
              data: stock,
              isLoading: false
            });
          })
          .catch(() => {
            this.setState({
              error: true
            });
          });
      });
    }
  }

  /* eslint-disable require-jsdoc */
  componentDidMount () {
    if (localStorage.companies !== undefined) {
      let companies = JSON.parse(localStorage.companies);

      this.setState({
        symbols: companies.map((company) => {
          return {
            value: company.symbol,
            label: company.name
          };
        })
      }, this.fetchStockDetails);
    } else {
      dataRequests.getSymbols()
        .then((companies) => {
          localStorage.companies = JSON.stringify(companies);

          this.setState({
            symbols: companies.map((company) => {
              return {
                value: company.symbol,
                label: company.name
              };
            })
          }, this.fetchStockDetails);
        })
        .catch(() => {
          this.setState({
            error: true
          });
        });
    }
  }

  /**
   * Toggles the chart lines
   *
   * @param {object} event The react event object
   * @memberof App
   * @returns {undefined}
   */
  _handleInputChange (event) {
    const target = event.target;

    this.setState({
      [target.name]: target.checked
    });
  }

  /**
   * Updates the company selection
   *
   * @param {object} selectedOption The selected company
   * @memberof App
   * @returns {undefined}
   */
  _handleCompanyChange (selectedOption) {
    this.setState({
      selectedCompany: selectedOption.value
    }, this.fetchStockDetails);
  }

  /* eslint-disable require-jsdoc */
  render () {
    let lines = [],
        appClassName = classnames('app', {
          error: this.state.error
        }),
        chartContainerClassName= classnames('chart-container', {
          loading: this.state.isLoading
        });

    /* istanbul ignore else */
    if (this.state.showOpening === true) {
      lines.push(<Area type="monotone" dataKey="open" stroke="#AF0B0B" fill="url(#open)" activeDot={{r: 8}} />);
    }
    /* istanbul ignore else */
    if (this.state.showClosing === true) {
      lines.push(<Area type="monotone" dataKey="close" stroke="#AF550B" fill="url(#close)" activeDot={{r: 8}} />);
    }
    /* istanbul ignore else */
    if (this.state.showHighest === true) {
      lines.push(<Area type="monotone" dataKey="high" stroke="#076969" fill="url(#high)" activeDot={{r: 8}} />);
    }
    /* istanbul ignore else */
    if (this.state.showLowest === true) {
      lines.push(<Area type="monotone" dataKey="low" stroke="#098C09" fill="url(#low)" activeDot={{r: 8}} />);
    }

    return (
      <div className={appClassName}>
        <div className="toolbox">
          <Select className="symbol-selector" name="form-field-name" value={this.state.selectedCompany} onChange={this.handleCompanyChange} options={this.state.symbols} />
          <label>
            <input name="showOpening" type="checkbox" checked={this.state.showOpening} onChange={this.handleInputChange} />
            <span>Show Opening</span>
          </label>
          <label>
            <input name="showClosing" type="checkbox" checked={this.state.showClosing} onChange={this.handleInputChange} />
            <span>Show Closing</span>
          </label>
          <label>
            <input name="showHighest" type="checkbox" checked={this.state.showHighest} onChange={this.handleInputChange} />
            <span>Show Highest</span>
          </label>
          <label>
            <input name="showLowest" type="checkbox" checked={this.state.showLowest} onChange={this.handleInputChange} />
            <span>Show Lowest</span>
          </label>
        </div>
        <div className={chartContainerClassName}>
          <div className="loader">
            <svg viewBox="0 0 32 32" width="32" height="32">
              <circle className="spinner" cx="16" cy="16" r="14" fill="none"></circle>
            </svg>
          </div>
          <ResponsiveContainer>
            <AreaChart data={this.state.data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <defs>
                <linearGradient id="high" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#076969" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#076969" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="low" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#098C09" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#098C09" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="close" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AF550B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#AF550B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="open" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AF0B0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#AF0B0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="label"/>
              <YAxis domain={['dataMin', 'dataMax']} />
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend />
              {lines}
            </AreaChart>
          </ResponsiveContainer>
          {/* <AreaChart data={[data]} width={this.state.containerWidth} /> */}
        </div>
      </div>
    );
  }
}

App.displayName = 'App';

export default App;
