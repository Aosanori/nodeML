import moment from 'moment';

const mergeLists = ( array1: any, array2: any,array3: any,array4: any,array5: any) =>
  array1.map((_: any, i: any) => Object.assign(array1[i], array2[i],array3[i],array4[i],array5[i]));

  function dataLists(PredData: any) {
    if (PredData !== undefined) {
      const WeatherList = Object.entries(PredData.Weather).map(
       ([key, value]) => ({
        time: moment(key)
         .utc()
         .format('DD日HH時'),
        Weather: value,
       }),
      );
      const TempList = Object.entries(PredData.Temp).map(([key, value]:any) => ({
       time: moment(key)
        .utc()
        .format('DD日HH時'),
       Temp: Math.round(value * 10) / 10,
      }));
        const PressureList = Object.entries(PredData.Pressure).map(
         ([key, value]:any) => ({
          time: moment(key)
           .utc()
           .format('DD日HH時'),
          Pressure: Math.round(value * 10) / 10,
         }),
        );
        const HumidityList = Object.entries(PredData.Humidity).map(
         ([key, value]:any) => ({
          time: moment(key)
           .utc()
           .format('DD日HH時'),
          Humidity: Math.round(value * 10) / 10,
         }),
        );
      const ProbabilityOfRainList = Object.entries(PredData.ProbabilityOfRain).map(
         ([key, value]:any) => ({
          time: moment(key)
           .utc()
           .format('DD日HH時'),
          ProbabilityOfRain: (Math.round(value * 10) / 10)*100,
         }),
        );
      return mergeLists(WeatherList,TempList,PressureList,HumidityList,ProbabilityOfRainList);
    }
    return [];
  }
const weatherForecastReducer = ( dataState: any, action: any ) =>
{
  switch (action.type) {
    case 'FETCH_INIT':
      console.log('Fetching');
      return {
        isLoading: true,
        data: {},
        isError: '',
      };
    // データの取得に成功した場合
    // 成功なので、isErrorは''
    // postにはactionで渡されるpayloadを代入
      case 'FETCH_SUCCESS':
          console.log( JSON.parse( action.payload) )
          return {
              isLoading: false,
              isError: '',
              PredWeather: dataLists(JSON.parse( action.payload )),
          };
    // データの取得に失敗した場合
    // 成功なので、isErrorにエラーメッセージを設定
    case 'FETCH_ERROR':
      return {
        isLoading: false,
        data: {},
        isError: '読み込みに失敗しました',
      };
    // defaultではそのまま渡ってきたstateを返しておく
    default:
      return dataState;
  }
};

export default weatherForecastReducer;
