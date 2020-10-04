import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App.js';
import { TempDataContextProvider } from './provider/tempDataProvider.js';
import { IndexContextProvider } from './provider/indexProvider'
import {WeatherForecastContextProvider} from './provider/weatherForecastProvider'

ReactDOM.render(
  <IndexContextProvider>
    <WeatherForecastContextProvider>
      <TempDataContextProvider>
        <App />
      </TempDataContextProvider>
    </WeatherForecastContextProvider>
  </IndexContextProvider>,
  document.getElementById( 'index' )
);
