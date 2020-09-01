const tempDataFetchReducer = (dataState, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      console.log('Fetching')
      return {
        isLoading: true,
        data: {},
        isError: '',
      };
    //データの取得に成功した場合
    //成功なので、isErrorは''
    //postにはactionで渡されるpayloadを代入
    case 'FETCH_SUCCESS':
      return {
        isLoading: false,
        isError: '',
        MaxTempScore: action.payload[0],
        MinTempScore: action.payload[1],
        MaxTempPredR2Score: action.payload[2],
        MinTempPredR2Score: action.payload[3],
        TodayMaxTemp: action.payload[4],
        TodayMinTemp: action.payload[5],
        PredData: JSON.parse(action.payload[6]),
      };
    //データの取得に失敗した場合
    //成功なので、isErrorにエラーメッセージを設定
    case 'FETCH_ERROR':
      return {
        isLoading: false,
        data: {},
        isError: '読み込みに失敗しました',
      };
    //defaultではそのまま渡ってきたstateを返しておく
    default:
      return dataState;
  }
};

export default tempDataFetchReducer
