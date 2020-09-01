/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {TempDataContext}from'../provider/tempDataProvider';
import Title from './Title.js';


function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
} );

// eslint-disable-next-line react/prop-types
const Deposits = () =>
{
  const { state } = useContext( TempDataContext ); 
  console.log(state)
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Max Temperature</Title>
      <Typography component="p" variant="h4">
        {state.data[4]}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Deposits