'use strict';

import apiRoutes from './api';

let attach;

attach = (app) => {
  app.use(apiRoutes);
};

export default {
  attach: attach
};
