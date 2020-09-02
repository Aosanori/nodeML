import React, { useContext } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TempDataContext } from '../provider/tempDataProvider';
import moment from 'moment';
import Title from './Title.js';

const CompareChart = (props) => {
  const theme = useTheme();
  const { state } = useContext(TempDataContext);

  
  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          // eslint-disable-next-line react/prop-types
          data={props.data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            labelFormatter={(props) => moment(props).format("YYYY/MM/DD(ddd)")}
          />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
            >
              Temp (°C)
            </Label>
          </YAxis>
          <CartesianGrid // ガイド線の表示
            stroke="#ccc"
            strokeDasharray="3 3"
          />
          <Tooltip // ツールチップの表示
            labelFormatter={(props) => moment(props).format("YYYY/MM/DD(ddd)")} // ラベルの表示フォーマット（日付）
          />
          <Line
            type="monotone"
            dataKey="PredMaxTemp"
            stroke="salmon"
            dot={true}
            unit="℃"
          />
          <Line
            type="monotone"
            dataKey="PredMinTemp"
            stroke="skyblue"
            dot={true}
            unit="℃"
          />
          <Line
            type="monotone"
            dataKey="ForecastMaxTemp"
            stroke="red"
            dot={true}
            unit="℃"
          />
          <Line
            type="monotone"
            dataKey="ForecastMinTemp"
            stroke="blue"
            dot={true}
            unit="℃"
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default CompareChart;
