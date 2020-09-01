import React, { useContext } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import { TempDataContext } from '../provider/tempDataProvider';
import moment from 'moment';

import Title from './Title.js';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const  Chart = () => {
  const theme = useTheme();
  const { state } = useContext(TempDataContext); 
  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={
            !state.PredData
              ? []
              : Object.entries(state.PredData.Max).map(([key, value]) =>
                  createData(moment(key).format('YYYY-MM-DD'), value)
                )
          }
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Temp (°C)
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}

export default Chart