import React,{useEffect,useState} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title.js';
import axios from 'axios';


function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
} );

const apiURL = 'http://localhost:8080/api';


const Deposits = () =>
{
  const [data, setData] = useState('');
  const getData = () => {
    axios.get( apiURL  ).then( ( res ) => { setData( res.data ) });
  };
  //initState?
  useEffect(() => getData(), []);

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        {data[5]}
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