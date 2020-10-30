import React, { useReducer, createContext } from 'react';

import weatherForecastReducer from '../reducer/weatherForecastReducer';
import initialTempState from '../initialState/initialTempState';

// React Contextの作成
export const WeatherForecastContext = createContext<any>({});
// Reducer関数の初期値

// コンテキストプロバイダーコンポーネント
// eslint-disable-next-line react/prop-types
export const WeatherForecastContextProvider = ({
  children
}: any) => {
         // useReducerでreducer関数と初期値をセット
         const [state, dispatch] = useReducer(
           weatherForecastReducer,
           initialTempState
         );
         return (
           <WeatherForecastContext.Provider value={{ state, dispatch }}>
             {children}
           </WeatherForecastContext.Provider>
         );
       };

// コンテキストコンシュマーの作成(今回未使用)
export const WeatherForecastContextConsumer = WeatherForecastContext.Consumer;
