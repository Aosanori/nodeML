/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import { TempDataContext } from '../provider/tempDataProvider';
import Title from './Title.js';

const ScoreDisplay = (props) =>
    {
      const { state } = useContext(TempDataContext);
      console.log(state);
      return (
        <React.Fragment>
              <Title>{props.title}</Title>
          <Typography component="p" variant="h4">
            {Math.round(props.score * 1000) / 1000}
          </Typography>
        </React.Fragment>
      );
    }

    export default ScoreDisplay