'use strict';

import React from 'react';
import { render } from 'react-dom';
import App from '../../../lib/views';

if (typeof window !== 'undefined') {
  window.onload = () => {
    var props = {
      path: location.pathname
    };
    render(React.createElement(App, props), document.getElementById('reactView'));
    document.querySelector('.app-loader').setAttribute('hidden', true);
  };

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./assets/service-worker.js');
  }
}
