import moment from 'moment';

const mergeLists = ( array1, array2,array3,array4) =>
  array1.map((_, i) => Object.assign(array1[i], array2[i],array3[i],array4[i]));

  function dataLists(PredData) {
    if (PredData !== undefined) {
      const WeatherList = Object.entries(PredData.Weather).map(
       ([key, value]) => ({
        time: moment(key)
         .utc()
         .format('DD日HH時'),
        Weather: value,
       }),
      );
      const TempList = Object.entries(PredData.Temp).map(([key, value]) => ({
       time: moment(key)
        .utc()
        .format('DD日HH時'),
       Temp: Math.round(value * 10) / 10,
      }));
        const PressureList = Object.entries(PredData.Pressure).map(
         ([key, value]) => ({
          time: moment(key)
           .utc()
           .format('DD日HH時'),
          Pressure: Math.round(value * 10) / 10,
         }),
        );
        const HumidityList = Object.entries(PredData.Humidity).map(
         ([key, value]) => ({
          time: moment(key)
           .utc()
           .format('DD日HH時'),
          Humidity: Math.round(value * 10) / 10,
         }),
        );
      return mergeLists(WeatherList,TempList,PressureList,HumidityList);
    }
    return [];
  }
const weatherForecastReducer = ( dataState, action ) =>
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
          console.log( JSON.parse( action.payload[9]) )
          return {
              isLoading: false,
              isError: '',
              WeatherAccuracy: action.payload[0],
              TemperatureAccuracy: action.payload[1],
              PressureAccuracy: action.payload[2],
              HumidityAccuracy: action.payload[3],
              VaporPressureAccuracy: action.payload[4],
              PredTempR2Score: action.payload[5],
              PredPressureR2Score: action.payload[6],
              PredHumidityR2Score: action.payload[7],
              PredVaporPressureR2Score: action.payload[8],
              PredWeather: dataLists(JSON.parse( action.payload[9] )),
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
