import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App.js';
import { TempDataContextProvider } from './provider/tempDataProvider.js';

ReactDOM.render(
  <TempDataContextProvider>
    <App />
  </TempDataContextProvider>,
  document.getElementById('index')
);
