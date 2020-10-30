import React, { useReducer,createContext } from 'react';

import tempDataFetchReducer from '../reducer/tempDataFetchReducer';
import initialTempState from '../initialState/initialTempState';

// React Contextの作成
export const TempDataContext = createContext<any>({});
// Reducer関数の初期値


// コンテキストプロバイダーコンポーネント
// eslint-disable-next-line react/prop-types
export const TempDataContextProvider = ( {
  children
}: any ) =>
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

