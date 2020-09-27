import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App.js';
import { TempDataContextProvider } from './provider/tempDataProvider.js';
import { IndexContextProvider} from './provider/indexProvider'

ReactDOM.render(
  <IndexContextProvider>
  <TempDataContextProvider>
    <App />
    </TempDataContextProvider>
  </IndexContextProvider>,
  document.getElementById('index')
);
