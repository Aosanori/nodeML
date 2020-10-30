import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext }from 'react';
import '../App.css';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { WeatherForecastContext } from '../provider/weatherForecastProvider';
import LinearProgress from '@material-ui/core/LinearProgress';
//import { StickyTable, Row, Cell } from 'react-sticky-table';
const { StickyTable, Row, Cell } = require('react-sticky-table')
const { WiDaySunny, WiCloud,WiRain,WiSnow } = require('weather-icons-react');

function stringToImageWeather (weather: any) {
    if ( weather == '晴' )
    {
        return <WiDaySunny size={24} color="#000" />;
    }
    if (weather == '曇') {
     return <WiCloud size={24} color="#000" />;
    }
    if (weather == '雨') {
     return <WiRain size={24} color="#000" />;
    }
    if (weather == '雪') {
     return <WiSnow size={24} color="#000" />;
    }
    return weather;
}


export const WeatherDashboard = () =>
{    const { state } = useContext(WeatherForecastContext);

    const classes = useStyles();
        const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    console.log( state );
    return (
        <Container maxWidth="lg" className={classes.container}>
         <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={12} lg={12}>
           <Paper className={clsx(classes.paper, classes.fixedHeight2)}>
            {state.isLoading ? (
             <LinearProgress />
            ) : (
             <StickyTable>
              <Row>
               <Cell>時間</Cell>
               {state.PredWeather.map((item: any, i: any) => {
                return <Cell key={i}>{item.time}</Cell>; //keyを指定
               })}
              </Row>
              <Row>
               <Cell>天気</Cell>
               {state.PredWeather.map((item: any, i: any) => {
                return <Cell key={i}>{stringToImageWeather(item.Weather)}</Cell>; //keyを指定
               })}
              </Row>
              <Row>
               <Cell>気温</Cell>
               {state.PredWeather.map((item: any, i: any) => {
                return <Cell key={i}>{item.Temp}℃</Cell>; //keyを指定
               })}
               </Row>
               <Row>
               <Cell>降水確率</Cell>
               {state.PredWeather.map((item: any, i: any) => {
                   return <Cell key={i}>{item.ProbabilityOfRain}%</Cell>;//keyを指定
               })}
              </Row>
              <Row>
               <Cell>湿度</Cell>
               {state.PredWeather.map((item: any, i: any) => {
                return <Cell key={i}>{item.Humidity}%</Cell>; //keyを指定
               })}
              </Row>
              <Row>
               <Cell>気圧</Cell>
               {state.PredWeather.map((item: any, i: any) => {
                return <Cell key={i}>{item.Pressure}hPa</Cell>; //keyを指定
               })}
              </Row>
             </StickyTable>
            )}
           </Paper>
          </Grid>
          
         </Grid>

         <Box pt={4}></Box>
        </Container>
    );
}

const useStyles = makeStyles( ( theme ) => ( {
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create( ['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        } ),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create( 'width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        } ),
        width: theme.spacing( 7 ),
        [theme.breakpoints.up( 'sm' )]: {
            width: theme.spacing( 9 ),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing( 4 ),
        paddingBottom: theme.spacing( 4 ),
    },
    paper: {
        padding: theme.spacing( 2 ),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    fixedHeight2: {
        height: 280,
    },
    fixedHeight3: {
        height: 220,
    },
} ) );
