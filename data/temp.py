import pandas as pd 
import codecs
import numpy as np
from matplotlib import pyplot as plt 
from sklearn.linear_model import LinearRegression as LR
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import make_scorer
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
import pandas.tseries.offsets as offsets
import tensorflow
import keras

t = 270
period = 30
leaf = 20
data = pd.read_csv("/Users/odatesshuu/program/react-starter-master/data/kyoto.csv")

data.shape

#data.describe()

#data.info()

df=pd.DataFrame()
df["datetime"]=pd.to_datetime(data["年月日"])
df["Max_temp"]=data["最高気温(℃)"]
df["Min_temp"]=data["最低気温(℃)"]
df = df.set_index("datetime", drop=True)

def week_dataset(df):
    tmp=np.zeros((2,t,len(df)))
    for i in range(1,t):
        for j in range(len(df)):
            tmp[0][i][j]=df.Max_temp.iloc[j-i]
            tmp[1][i][j]=df.Min_temp.iloc[j-i]
        df[str("Max -")+str(i)]=tmp[0][i]
        df[str("Min -")+str(i)]=tmp[1][i]
    return df
        
df=week_dataset(df)
        
#df.head()

X=df.drop(["Max_temp","Min_temp"],axis=1)
Y_Max=df["Max_temp"]
Y_Min=df["Min_temp"]

X_train=X[:-365]
X_test=X[-365:]
Y_Max_train=Y_Max[:-365]
Y_Max_test=Y_Max[-365:]
Y_Min_train=Y_Min[:-365]
Y_Min_test=Y_Min[-365:]

#X_train.head()

forest_Max = RandomForestRegressor(min_samples_leaf=leaf, random_state=0)
forest_Max.fit(X_train, Y_Max_train)
forest_Min = RandomForestRegressor(min_samples_leaf=leaf, random_state=0)
forest_Min.fit(X_train, Y_Min_train)

#MaxTempScore
print(forest_Max.score(X_train, Y_Max_train))
print(forest_Min.score(X_train, Y_Min_train))

Y_Max_pred=forest_Max.predict(X_test)
Y_Min_pred=forest_Min.predict(X_test)

result=pd.DataFrame([Y_Max_pred,Y_Min_pred],index=["MaxTemp_pred","MinTemp_pred"]).T
result.index=X_test.index
result["MaxTemp_act"]=Y_Max_test
result["MinTemp_act"]=Y_Min_test

print(r2_score(Y_Max_test, Y_Max_pred))
print(r2_score(Y_Min_test, Y_Min_pred))

#print(result)

#result.plot(figsize=(30,9))

pred=pd.DataFrame()
pred["datetime"] = pd.to_datetime([result.index[-1]])
pred.index=pred.datetime
pred=pred.drop("datetime",axis=1)
for i in range(1,t):
    pred["Max -"+str(i)] = result.MaxTemp_act[-i]
    pred["Min -"+str(i)] = result.MinTemp_act[-i]

Y_Max_pred = forest_Max.predict(pred)[0]
Y_Min_pred = forest_Min.predict(pred)[0]

print(Y_Max_pred)
print(Y_Min_pred)
#最初の予測を突っ込む
today = result.index[-1]
predList = pd.DataFrame(
    {'Max': [Y_Max_pred], 'Min': [Y_Min_pred]}
)
predList["datetime"] = pd.to_datetime([today + offsets.Day()])
predList.index = predList.datetime
predList = predList.drop("datetime", axis=1)

#一個右にずらしながら格納していく
newPred = pd.DataFrame()
today = result.index[-1]
for g in range(2, period):
    newPred["datetime"] = pd.to_datetime([today + offsets.Day(g)])
    newPred.index = newPred.datetime
    newPred = newPred.drop("datetime", axis=1)
    newPred["Max -1"] = Y_Max_pred
    newPred["Min -1"] = Y_Min_pred
    for i in range(1, t-1):
        newPred["Max -"+str(i+1)] = pred["Max -"+str(i)][0]
        newPred["Min -"+str(i+1)] = pred["Min -"+str(i)][0]
    Y_Max_pred = forest_Max.predict(newPred)[0]
    Y_Min_pred = forest_Min.predict(newPred)[0]
    predList.loc[today + offsets.Day(g)] = [Y_Max_pred, Y_Min_pred]

    pred = newPred
print(predList.to_json(date_format='iso'))
