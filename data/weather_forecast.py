import joblib
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras import layers
import pandas.tseries.offsets as offsets
from sklearn.metrics import r2_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression as LR
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from sklearn.metrics import accuracy_score
#from sklearn.externals import joblib

data = pd.read_csv(
    "/Users/odatesshuu/program/react-starter-master/data/kyoto_init.csv")
data.shape

t = 168

period = 72

df = pd.DataFrame()
df["datetime"] = pd.to_datetime(data["年月日時"])
df["Temp"] = data["気温(℃)"]
#df["Min_temp"] = data["最低気温(℃)"]
#df["Precipitation_amount"] = data["降水量(mm)"]
#df["Daylight_hours"]=data["日照時間(時間)"]
df["Windspeed"] = data["風速(m/s)"]
df["WindDirection"] = data["風向"]
df["Pressure"] = data["海面気圧(hPa)"]
df["Humidity"] = data["相対湿度(％)"]
#df["VaporPressure"]=data["蒸気圧(hPa)"]
df["Weather"] = data["天気"]
df = df.set_index("datetime", drop=True)
#df = pd.get_dummies(df, drop_first=True, prefix='', prefix_sep='')
df['WindDirection'] = df['WindDirection'].map({'北': 0, '北北東': 0, '北東': 0, '東北東': 0, '東': 0, '東南東': 0,
                                               '南東': 0, '南南東': 0, '南': 1, '南南西': 1, '南西': 1, '西南西': 1, '西': 1, '西北西': 1, '北西': 1, '北北西': 1})
df.fillna(method='bfill', inplace=True)
df.fillna(method='ffill', inplace=True)


def week_dataset(df):
    tmp = np.zeros((len(df.columns)-1, t, len(df)))
    for i in range(1, t):
        for j in range(len(df)):
            tmp[0][i][j] = df.Temp.iloc[j-i]
            tmp[1][i][j] = df.Pressure.iloc[j-i]
            tmp[2][i][j] = df.Humidity.iloc[j-i]
            #tmp[3][i][j] = df.VaporPressure.iloc[j-i]
            tmp[3][i][j] = df.Windspeed.iloc[j-i]
            tmp[4][i][j] = df.WindDirection.iloc[j-i]
        df[str("Temp_-")+str(i)] = tmp[0][i]
        df[str("Pressure_-")+str(i)] = tmp[1][i]
        df[str("Humidity_-")+str(i)] = tmp[2][i]
        #df[str("VaporPressure_-")+str(i)] = tmp[3][i]
        df[str("Windspeed_-")+str(i)] = tmp[3][i]
        df[str("WindDirection_-")+str(i)] = tmp[4][i]
    #df.drop(columns=["Temp","Pressure", "Humidity"], inplace=True)
    return df


df = week_dataset(df)

df.head()

def convertToStringWeather(df):
    categories = ["Weather"]
    df["Weather"] = df['Weather'].astype(str)
    df['Weather'] = df['Weather'].str.replace('10.0|101.0', '雨', regex=True)
    df['Weather'] = df['Weather'].str.replace('11.0', '雪', regex=True)
    df['Weather'] = df['Weather'].str.replace('12.0|13.0', '雪', regex=True)
    df['Weather'] = df['Weather'].str.replace('15.0', '曇', regex=True)
    df['Weather'] = df['Weather'].str.replace('2.0|1.0', '晴', regex=True)
    df['Weather'] = df['Weather'].str.replace('4.0|3.0', '曇', regex=True)
    return df, categories


df, categories = convertToStringWeather(df)


def makeData(df):
    #df = oversampling(df)
    dummy_df = pd.get_dummies(data=df["Weather"], drop_first=True)
    df = pd.concat([df, dummy_df], axis=1)
    del df["Weather"]
    #df.drop(columns=["Weather","Temp","Pressure", "Humidity"], inplace=True)
    return df


dummied_df = df


def df_to_dataset(dataframe, shuffle=True, batch_size=32):
    dataframe = dataframe.copy()
    try:
        labels = dataframe.pop('Weather')
        ds = tf.data.Dataset.from_tensor_slices((dict(dataframe), labels))
        ds = ds.batch(batch_size)
        return ds
    except:
        ds = tf.data.Dataset.from_tensor_slices((dict(dataframe)))
        ds = ds.batch(batch_size)
        return ds


def restoreWeatherModel(path):
    model = tf.keras.models.load_model(path)
    return model


weatherClf = restoreWeatherModel(
    '/Users/odatesshuu/program/react-starter-master/data/models/weatherModel')
tempReg = joblib.load(
    '/Users/odatesshuu/program/react-starter-master/data/models/finalized_Temp_Model.sav')
pressureReg = joblib.load(
    '/Users/odatesshuu/program/react-starter-master/data/models/finalized_Pressure_Model.sav')
humidityReg = joblib.load(
    '/Users/odatesshuu/program/react-starter-master/data/models/finalized_Humidity_Model.sav')
WindDirectionReg = joblib.load(
    '/Users/odatesshuu/program/react-starter-master/data/models/finalized_WindDirection_Model.sav')
WindspeedReg = joblib.load(
    '/Users/odatesshuu/program/react-starter-master/data/models/finalized_Windspeed_Model.sav')


def initPredList(df):
    now = df.index[-1]
    predList = pd.DataFrame(
        {'Temp': df.Temp[-1], 'Pressure': df.Pressure[-1], 'Humidity': df.Humidity, "Windspeed": df.Windspeed[-1], "WindDirection": df.WindDirection[-1],'ProbabilityOfRain':0, "Weather": df['Weather'][-1]}, index=[now]
    )
    predList["datetime"] = pd.to_datetime([now])
    predList.index = predList.datetime
    predList = predList.drop("datetime", axis=1)
    return predList


predList = initPredList(dummied_df)
pred = dummied_df.tail(1).drop(columns=np.append(
    categories, ["Temp", "Pressure", "Humidity", "Windspeed", "WindDirection"]))


def returnToWeather(weather):
    if((weather == 0.0) | (weather == 0)):
        return '晴'
    elif(weather == 1.0):
        return '曇'
    elif(weather == 2.0):
        return '雨'
    elif(weather == 3.0):
        return '雪'


newPred = pd.DataFrame()
today = dummied_df.index[-1]
Temp_Pred = predList['Temp'][0]
Pressure_Pred = predList['Pressure'][0]
Humidity_Pred = predList['Humidity'][0]
Windspeed_Pred = predList['Windspeed'][0]
WindDirection_Pred = predList["WindDirection"][0]

for g in range(1, period):
    newPred["datetime"] = pd.to_datetime([today + offsets.Hour(g)])
    newPred.index = newPred.datetime
    newPred = newPred.drop("datetime", axis=1)
    newPred["Temp_-1"] = Temp_Pred
    newPred["Pressure_-1"] = Pressure_Pred
    newPred["Humidity_-1"] = Humidity_Pred
    newPred["WindDirection_-1"] = WindDirection_Pred
    newPred["Windspeed_-1"] = Windspeed_Pred
    #newPred["VaporPressure_-1"] = VaporPressure_Pred
    for i in range(1, t-1):
        newPred["Temp_-"+str(i+1)] = pred["Temp_-"+str(i)][0]
        newPred["Pressure_-"+str(i+1)] = pred["Pressure_-"+str(i)][0]
        newPred["Humidity_-"+str(i+1)] = pred["Humidity_-"+str(i)][0]
        newPred["WindDirection_-"+str(i+1)] = pred["WindDirection_-"+str(i)][0]
        newPred["Windspeed_-"+str(i+1)] = pred["Windspeed_-"+str(i)][0]
        #newPred["VaporPressure_-"+str(i+1)] = pred["VaporPressure_-"+str(i)][0]
    Temp_Pred = tempReg.predict(newPred)[0]
    Pressure_Pred = pressureReg.predict(newPred)[0]
    Humidity_Pred = humidityReg.predict(newPred)[0]
    WindDirection_Pred = WindDirectionReg.predict(newPred)[0]
    Windspeed_Pred = WindspeedReg.predict(newPred)[0]
    Weather_Pred = returnToWeather(
        weatherClf.predict_classes(df_to_dataset(newPred))[0])
    predList.loc[today + offsets.Hour(g)] = [Temp_Pred, Pressure_Pred,
                                             Humidity_Pred, Windspeed_Pred, WindDirection_Pred, weatherClf.predict(df_to_dataset(newPred))[0][2]+weatherClf.predict(df_to_dataset(newPred))[0][3], Weather_Pred]
    pred = newPred

print(predList.to_json(date_format='iso',force_ascii=False))
