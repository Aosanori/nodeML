import moment from 'moment';

const mergeLists = (array1, array2) =>
  array1.map( ( _, i ) => Object.assign( array1[i], array2[i] ) );

function dataLists(PredData)
{
  if (PredData !== undefined) {
    const maxList = Object.entries(PredData.Max).map(([key, value]) => ({
      time: moment(key).format('YYYY/MM/DD'),
      MaxTemp: Math.round(value * 10) / 10,
    }));
    const minList = Object.entries(PredData.Min).map(([key, value]) => ({
      time: moment(key).format('YYYY/MM/DD'),
      MinTemp: Math.round(value * 10) / 10,
    }));
    return mergeLists(maxList, minList);
  }
  return [];
}

const tempDataFetchReducer = ( dataState, action ) =>
{
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
        PredData: JSON.parse( action.payload[6] ),
        FittedPredData:dataLists(JSON.parse( action.payload[6] )),
        ActuallyMaxTemp: action.payload[7],
        ActuallyMinTemp: action.payload[8],
        MaxTempTime: action.payload[9],
        MinTempTime: action.payload[10],
        ActuallyMaxTempList:JSON.parse( action.payload[11]),
        ActuallyMinTempList: JSON.parse(action.payload[12]),
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
