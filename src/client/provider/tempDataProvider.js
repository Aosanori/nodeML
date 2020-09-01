import React, { useReducer,createContext } from 'react';

import tempDataFetchReducer from '../reducer/tempDataFetchReducer.js';
import initialTempState from '../initialState/initialTempState.js';

// React Contextの作成
export const TempDataContext = createContext();
// Reducer関数の初期値


// コンテキストプロバイダーコンポーネント
// eslint-disable-next-line react/prop-types
export const TempDataContextProvider = ( { children } ) =>
{
  // useReducerでreducer関数と初期値をセット
  const [state, dispatch] = useReducer(
    tempDataFetchReducer,
    initialTempState
  );
  return (
    <TempDataContext.Provider value={{state, dispatch}}>
      {children}
    </TempDataContext.Provider>
  );
};

// コンテキストコンシュマーの作成(今回未使用)
export const TempDataContextConsumer = TempDataContext.Consumer;

