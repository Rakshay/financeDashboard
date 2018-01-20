'use strict';

import nconf from 'nconf';
import configuration from './configuration';
import packageJSON from './package.json';

nconf.argv()
  .env()
  .defaults(Object.assign({}, configuration));

if (nconf.get('build') === undefined) {
  nconf.overrides({
    build: packageJSON.version
  });
}
