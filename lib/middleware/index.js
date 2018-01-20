'use strict';

import bodyParser from 'body-parser';

const setNoCache = (req, res, next) => {
  if (req.url.indexOf('api') !== -1) {
    res.setHeader('Cache-Control', 'no-cache,no-store');
  }
  next();
};

const rawBodyParser = bodyParser.raw({
  limit: '50mb'
});

const encodedBodyParser = bodyParser.urlencoded({
  extended: true,
  limit: '5mb'
});

const jsonBodyParser = bodyParser.json();

export default {
  setNoCache,
  rawBodyParser,
  encodedBodyParser,
  jsonBodyParser
};
