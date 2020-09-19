from keras.optimizers import SGD
import re
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras import layers
import tensorflow as tf
import pandas.tseries.offsets as offsets
from sklearn.metrics import r2_score
from sklearn.metrics import mean_squared_error
from sklearn.metrics import make_scorer
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression as LR
from tensorflow import feature_column
import pandas as pd
import codecs
import numpy as np
from matplotlib import pyplot as plt

data = pd.read_csv(
    "/Users/odatesshuu/program/react-starter-master/data/kyoto_weather.csv")
data.shape

df = pd.DataFrame()
df["datetime"] = pd.to_datetime(data["年月日"])
df["Max_temp"] = data["最高気温(℃)"]
df["Min_temp"] = data["最低気温(℃)"]
df["Precipitation_amount"] = data["降水量の合計(mm)"]
df["Daylight_hours"] = data["日照時間(時間)"]
df["Average_windspeed"] = data["平均風速(m/s)"]
df["Average_pressure"] = data["平均海面気圧(hPa)"]
df["Average_humidity"] = data["平均湿度(％)"]

df["Weather"] = data["天気概況(昼：06時～18時)"]
df = df.set_index("datetime", drop=True)
df["Weather"] = df["Weather"].str.strip()
print(len(df["Weather"].unique()))

df['Weather'] = df['Weather'].str.replace(
    '(風|暴|霧|ひょう|あられ|雷|快|薄|みぞれ|を|、|伴う|薄|時々|一時|伴う|後|大)', '', regex=True)
df['Weather'].mask(df['Weather'].str.len() >= 3,
                   df['Weather'].str[:2], inplace=True)
df['Weather'].mask(df['Weather'].str.len() == 0, '雪', inplace=True)
df['Weather'] = df['Weather'].str.replace('(雪雨|雪曇)', '雪', regex=True)
df['Weather'] = df['Weather'].str.replace('(雪晴|晴雪)', '晴', regex=True)
df['Weather'] = df['Weather'].str.replace('(曇雪|雨晴|晴雨)', '曇', regex=True)
print(df["Weather"].unique())
category = len(df["Weather"].unique())

#LabelEncoderのインスタンスを生成
le = LabelEncoder()
#ラベルを覚えさせる
le = le.fit(df['Weather'])

#ラベルを整数に変換
df['Weather'] = le.transform(df['Weather'])

train, test = train_test_split(df, test_size=0.05)
train, val = train_test_split(train, test_size=0.05)
print(len(train), 'train examples')
print(len(val), 'validation examples')
print(len(test), 'test examples')


def df_to_dataset(dataframe, shuffle=True, batch_size=32):
  dataframe = dataframe.copy()
  labels = dataframe.pop('Weather')
  ds = tf.data.Dataset.from_tensor_slices((dict(dataframe), labels))
  if shuffle:
    ds = ds.shuffle(buffer_size=len(dataframe))
  ds = ds.batch(batch_size)
  return ds


batch_size = 50  # デモ用として小さなバッチサイズを使用
train_ds = df_to_dataset(train, batch_size=batch_size)
val_ds = df_to_dataset(val, shuffle=False, batch_size=batch_size)
test_ds = df_to_dataset(test, shuffle=False, batch_size=batch_size)

for feature_batch, label_batch in train_ds.take(1):
  print('Every feature:', list(feature_batch.keys()))
  print('A batch of targets:', label_batch)

feature_columns = []

# 数値コラム
for header in ['Max_temp', 'Min_temp', 'Precipitation_amount', 'Daylight_hours', 'Average_windspeed', 'Average_pressure', 'Average_humidity']:
    feature_columns.append(feature_column.numeric_column(header))

#特徴量層の構築
feature_layer = tf.keras.layers.DenseFeatures(feature_columns)

batch_size = 100
train_ds = df_to_dataset(train, batch_size=batch_size)
val_ds = df_to_dataset(val, shuffle=False, batch_size=batch_size)
test_ds = df_to_dataset(test, shuffle=False, batch_size=batch_size)

#モデルの構築、コンパイルと訓練
model = tf.keras.Sequential([
    feature_layer,
    layers.Dense(10, activation='relu', input_dim=len(feature_columns)),
    layers.Dense(10000, activation='relu'),
    layers.Dense(1, activation='softmax')
])

sgd = tf.keras.optimizers.SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(optimizer=sgd,
              loss='categorical_crossentropy',
              metrics=['accuracy'])

model.fit(train_ds,
          validation_data=val_ds,
          epochs=10, batch_size=128)

loss, accuracy = model.evaluate(test_ds)
print("Accuracy", accuracy)
