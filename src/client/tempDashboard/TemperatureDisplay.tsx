/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {TempDataContext}from'../provider/tempDataProvider';

function preventDefault(event: any) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
} );

// eslint-disable-next-line react/prop-types
const TemperatureDisplay = (props: any) => { 
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography component="p" variant="h4">
        {Math.round(props.Temp * 10) / 10}°C
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
      </Typography>
      <Typography component="p" variant="h6" className={classes.depositContext}>
        Actually
      </Typography>
      <Typography component="p" variant="h4">
        {Math.round(props.ActuallyTemp * 10) / 10}°C
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        from JMA @{props.TempTime}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}

export default TemperatureDisplay;