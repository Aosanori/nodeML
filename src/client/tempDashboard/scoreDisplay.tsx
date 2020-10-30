/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import { TempDataContext } from '../provider/tempDataProvider';

const ScoreDisplay = (props: any) => {
  const { state } = useContext(TempDataContext);
  console.log(state);
  return (
    <React.Fragment>
      <Typography component="p" variant="h4">
        {Math.round(props.score * 1000) / 1000}{props.unit!== undefined?props.unit:''}
      </Typography>
    </React.Fragment>
  );
}

    export default ScoreDisplay