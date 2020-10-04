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
    "/Users/odatesshuu/program/react-starter-master/data/kyoto_test.csv")
data.shape

t = 72

period = 24

data.shape
df = pd.DataFrame()
df["datetime"] = pd.to_datetime(data["年月日時"])
df["Temp"] = data["気温(℃)"]
df["Pressure"] = data["海面気圧(hPa)"]
df["Humidity"] = data["相対湿度(％)"]
df["VaporPressure"] = data["蒸気圧(hPa)"]
df["Weather"] = data["天気"]
df = df.set_index("datetime", drop=True)
df.fillna(method='bfill', inplace=True)
df.fillna(method='ffill', inplace=True)
numberOfColumns = len(df.columns)


def week_dataset(df):
    tmp = np.zeros((numberOfColumns-1, t, len(df)))
    for i in range(1, t):
        for j in range(len(df)):
            tmp[0][i][j] = df.Temp.iloc[j-i]
            #tmp[1][i][j] = df.Windspeed.iloc[j-i]
            #tmp[1][i][j] = df.WindDirection.iloc[j-i]
            tmp[1][i][j] = df.Pressure.iloc[j-i]
            tmp[2][i][j] = df.Humidity.iloc[j-i]
            tmp[3][i][j] = df.VaporPressure.iloc[j-i]
        df[str("Temp_-")+str(i)] = tmp[0][i]
        #df[str("Windspeed_-")+str(i)] = tmp[1][i]
        #df[str("WindDirection_-")+str(i)] = tmp[1][i]
        df[str("Pressure_-")+str(i)] = tmp[1][i]
        df[str("Humidity_-")+str(i)] = tmp[2][i]
        df[str("VaporPressure_-")+str(i)] = tmp[3][i]
    #df.drop(columns=["Temp","Pressure", "Humidity"], inplace=True)
    return df


df = week_dataset(df)

df.head()


df["Weather"] = df['Weather'].astype(str)
df['Weather'] = df['Weather'].str.replace('10.0|101.0', '雨', regex=True)
df['Weather'] = df['Weather'].str.replace('11.0', '雪', regex=True)
df['Weather'] = df['Weather'].str.replace('12.0|13.0', '雪', regex=True)
df['Weather'] = df['Weather'].str.replace('15.0', '曇', regex=True)
df['Weather'] = df['Weather'].str.replace('2.0|1.0', '晴', regex=True)
df['Weather'] = df['Weather'].str.replace('4.0|3.0', '曇', regex=True)

categories = np.delete(df["Weather"].unique(), 0, 0)
category = len(df["Weather"].unique())


def makeData(df):
    dummy_df = pd.get_dummies(data=df["Weather"], drop_first=True)
    df = pd.concat([df, dummy_df], axis=1)
    del df["Weather"]
    #df.drop(columns=["Weather","Temp","Pressure", "Humidity"], inplace=True)
    return df


dummied_df = makeData(df)


def makePredWeatherModel(df):
    train, test = train_test_split(df, test_size=0.35, shuffle=False)
    X_train = train.drop(columns=np.append(
        categories, ["Temp", "Pressure", "Humidity", "VaporPressure"]))
    Y_train = train.loc[:, categories]
    X_test = test.drop(columns=np.append(
        categories, ["Temp", "Pressure", "Humidity", "VaporPressure"]))
    Y_test = test.loc[:, categories]
    #sm = SMOTE(random_state=777)
    #X_train, Y_train = sm.fit_sample(X_train, Y_train)
    clf = RandomForestClassifier(
        n_jobs=-1, n_estimators=100, random_state=10000, verbose=True, class_weight='balanced')
    clf = clf.fit(X_train, Y_train)
    y_test_pred = clf.predict(X_test)
    #print(clf.score(X_train, Y_train))
    acc_score = accuracy_score(Y_test,  y_test_pred)
    #acc_score = clf.score(X_test,  y_test_pred)
    print(np.round(acc_score, 3))
    return clf

weatherClf = makePredWeatherModel(dummied_df)


def makePredRegressorModel(df, cat):
    train, test = train_test_split(df, test_size=0.15, shuffle=False)
    #print(len(train), 'train examples')
    #print(len(test), 'test examples')
    X_train = train.drop(columns=np.append(
        categories, ["Temp", "Pressure", "Humidity", "VaporPressure"]))
    Y_train = train.loc[:, [cat]]
    X_test = test.drop(columns=np.append(
        categories, ["Temp", "Pressure", "Humidity", "VaporPressure"]))
    Y_test = test.loc[:, [cat]]
    #print(X_train.head())
    #print(Y_train.head())
    if(cat != "WindDirection"):
        clf = RandomForestRegressor(n_jobs=-1, random_state=10)
    else:
        clf = RandomForestClassifier(
            n_jobs=-1, n_estimators=100, random_state=10, verbose=True)
        clf = clf.fit(X_train, Y_train)
        y_test_pred = clf.predict(X_test)
        #print(clf.score(X_train, Y_train))
        acc_score = accuracy_score(Y_test,  y_test_pred)
        print(cat, np.round(acc_score, 3))
        #acc_score = clf.score(X_test,  y_test_pred)
        return clf
    clf = clf.fit(X_train, Y_train)
    y_test_pred = clf.predict(X_test)
    acc_score = r2_score(Y_test,  y_test_pred)
    print(np.round(acc_score, 3))
    return clf


tempReg = makePredRegressorModel(dummied_df, 'Temp')
pressureReg = makePredRegressorModel(dummied_df, 'Pressure')
humidityReg = makePredRegressorModel(dummied_df, 'Humidity')
#WindDirectionReg = makePredRegressorModel(dummied_df,"WindDirection")
VaporReg = makePredRegressorModel(dummied_df, 'VaporPressure')


def predFuture(df, cat):
    train, test = train_test_split(df, test_size=0.15, shuffle=False)
    X_train = train.drop(columns=np.append(
        categories, ["Temp", "Pressure", "Humidity", "VaporPressure"]))
    Y_train = train.loc[:, [cat]]
    X_test = test.drop(columns=np.append(
        categories, ["Temp", "Pressure", "Humidity", "VaporPressure"]))
    Y_test = test.loc[:, [cat]]
    if(cat == 'Temp'):
        Y_pred = tempReg.predict(X_test)
    elif(cat == 'Pressure'):
        Y_pred = pressureReg.predict(X_test)
    elif(cat == 'Humidity'):
        Y_pred = humidityReg.predict(X_test)
    elif(cat == "WindDirection"):
        Y_pred = WindDirectionReg.predict(X_test)
    elif(cat == 'VaporPressure'):
        Y_pred = VaporReg.predict(X_test)
    result = pd.DataFrame([Y_pred], index=[cat+"_pred"]).T
    result.index = X_test.index
    result[cat+"_act"] = Y_test
    print("pred"+cat+" r2score", r2_score(Y_test, Y_pred))
    result.plot(figsize=(30, 9))
    return result


tempFuture = predFuture(dummied_df, 'Temp')
pressureFuture = predFuture(dummied_df, 'Pressure')
humidityFuture = predFuture(dummied_df, 'Humidity')
vaporFuture = predFuture(dummied_df, 'VaporPressure')
result = pd.concat([tempFuture, pressureFuture,
                    humidityFuture, vaporFuture], axis=1)


def initPredList(result):
    now = result.index[-1]
    predList = pd.DataFrame(
        {'Temp': result.Temp_pred[-1], 'Pressure': result.Pressure_pred[-1], 'Humidity': result.Humidity_pred[-1], "VaporPressure": result.VaporPressure_pred[-1], "Weather": df['Weather'][-1]}, index=[now]
    )
    predList["datetime"] = pd.to_datetime([now])
    predList.index = predList.datetime
    predList = predList.drop("datetime", axis=1)
    return predList


predList = initPredList(result)
pred = dummied_df.tail(1).drop(columns=np.append(
    categories, ["Temp", "Pressure", "Humidity", "VaporPressure"]))


def returnToWeather(weatherList):
    # ダミー変数化
    dummy_df = pd.get_dummies(df['Weather'])

    #直列化

    undummied_series = pd.Series(index=dummy_df.index)
    for col in range(0, len(categories)):
        if(weatherList[col] == 1):
            return categories[col]
        else:
            return df["Weather"].unique()[0]


newPred = pd.DataFrame()
today = result.index[-1]
Temp_Pred = predList['Temp'][0]
Pressure_Pred = predList['Pressure'][0]
Humidity_Pred = predList['Humidity'][0]
#WindDirection_Pred = predList["WindDirection"][0]
VaporPressure_Pred = predList["VaporPressure"][0]

for g in range(1, 24):
    newPred["datetime"] = pd.to_datetime([today + offsets.Hour(g)])
    newPred.index = newPred.datetime
    newPred = newPred.drop("datetime", axis=1)
    newPred["Temp_-1"] = Temp_Pred
    newPred["Pressure_-1"] = Pressure_Pred
    newPred["Humidity_-1"] = Humidity_Pred
    #newPred["WindDirection_-1"] = WindDirection_Pred
    newPred["VaporPressure_-1"] = VaporPressure_Pred
    for i in range(1, t-1):
        newPred["Temp_-"+str(i+1)] = pred["Temp_-"+str(i)][0]
        newPred["Pressure_-"+str(i+1)] = pred["Pressure_-"+str(i)][0]
        newPred["Humidity_-"+str(i+1)] = pred["Humidity_-"+str(i)][0]
        #newPred["WindDirection_-"+str(i+1)] = pred["WindDirection_-"+str(i)][0]
        newPred["VaporPressure_-"+str(i+1)] = pred["VaporPressure_-"+str(i)][0]
    Temp_Pred = tempReg.predict(newPred)[0]
    Pressure_Pred = pressureReg.predict(newPred)[0]
    Humidity_Pred = humidityReg.predict(newPred)[0]
    #WindDirection_Pred = WindDirectionReg.predict(newPred)[0]
    VaporPressure_Pred = VaporReg.predict(newPred)[0]
    Weather_Pred = weatherClf.predict(newPred)[0]
    predList.loc[today + offsets.Hour(g)] = [Temp_Pred, Pressure_Pred,
                                             Humidity_Pred, VaporPressure_Pred, returnToWeather(Weather_Pred)]
    pred = newPred

print(predList.to_json(date_format='iso',force_ascii=False))
