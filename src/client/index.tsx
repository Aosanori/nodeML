import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { TempDataContextProvider } from './provider/tempDataProvider';
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
