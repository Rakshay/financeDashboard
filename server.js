'use strict';

import express from 'express';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import methodOverride from 'method-override';
import compression from 'compression';
import path from 'path';
import nconf from 'nconf';
import logger from './lib/services/logger';
import middleware from './lib/middleware';

const buildDir = path.join(__dirname, 'public', 'assets');
const port = process.env.PORT || nconf.get('port');
const app = express();

app.use(morgan('dev', {
  stream: logger.stream
}));
app.use(compression());
app.use(methodOverride());
app.use(middleware.setNoCache);
app.use(middleware.encodedBodyParser);
app.use(middleware.jsonBodyParser);
app.use(middleware.rawBodyParser);
app.use(methodOverride());

app.set('port', port);
app.use(favicon(path.join(buildDir, 'favicon.ico')));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use((req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(port, () => {
  logger.log('info', `App started and listening at port ${port}`);
});

process.addListener('uncaughtException', (err) => {
  logger.error('Uncaught Error', err);
});

export default app;
