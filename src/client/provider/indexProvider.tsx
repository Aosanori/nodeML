import React, { useReducer, createContext } from 'react';

import indexReducer from '../reducer/IndexReducer';

// React Contextの作成
export const IndexContext = createContext<any>( { index : 0 });
// Reducer関数の初期値


// コンテキストプロバイダーコンポーネント
// eslint-disable-next-line react/prop-types
export const IndexContextProvider = ( {
    children
}: any ) =>
{
    // useReducerでreducer関数と初期値をセット
    const [state, dispatch] = useReducer(
        indexReducer,
        { index : 0 }
    );
    return (
        <IndexContext.Provider value={{ state, dispatch }}>
            {children}
        </IndexContext.Provider>
    );
};

// コンテキストコンシュマーの作成(今回未使用)
export const TempDataContextConsumer = IndexContext.Consumer;

