import axios from 'axios';

/**
 * Returns the list of supported aymbols
 *
 * @export
 * @returns {Promise} Promise object that returns all supported symbols
 */
export function getSymbols () {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: 'https://api.iextrading.com/1.0/ref-data/symbols'
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Returns the last month's stock value for the company
 *
 * @export
 * @param {string} symbol The NASDAQ symbol of the company
 * @returns {Promise} Promise object that returns stock value for the last month
 */
export function getStock (symbol) {
  return new Promise((resolve, reject) =>{
    axios({
      method: 'get',
      url: `https://api.iextrading.com/1.0/stock/${symbol}/chart/1m`
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}