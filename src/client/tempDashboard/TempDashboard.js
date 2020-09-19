import React, { useEffect, useContext } from 'react';
import '../App.css';
import axios from 'axios';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Chart from './Chart.js';
import TemperatureDisplay from './TemperatureDisplay.js';
import { TempDataContext } from '../provider/tempDataProvider.js';
import ScoreDisplay from './scoreDisplay.js'
import Title from './Title.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import CompareChart from './CompareChart.js';

const apiURL = 'http://localhost:8080/api';

function Copyright()
{
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const TempDashboard = () =>
{
    // useContextでThemeContextのstateとdispatchを使用する(コンテキスト値)
    const { state, dispatch } = useContext( TempDataContext );

    const getData = () =>
    {
        axios
            .get( apiURL + '/' )
            .then( ( res ) =>
            {
                dispatch( {
                    type: 'FETCH_SUCCESS',
                    payload: res.data,
                } );
            } )
            .catch( () =>
            {
                dispatch( { type: 'FETCH_ERROR' } );
            } );
    };

    function createCompareData()
    {
        if ( !state.isLoading )
        {
            const PredTemp = state.FittedPredData.slice( 0, 11 );
            const ForecastMaxTemp = state.ActuallyMaxTempList;
            const ForecastMinTemp = state.ActuallyMinTempList;
            var List = [];
            var diff = 0;
            for ( let i = 0; i < PredTemp.length; i++ )
            {
                diff +=
                    Math.abs( PredTemp[i].MaxTemp - ForecastMaxTemp[i] ) +
                    Math.abs( PredTemp[i].MinTemp - ForecastMinTemp[i] );
                List.push( {
                    time: PredTemp[i].time,
                    PredMaxTemp: PredTemp[i].MaxTemp,
                    PredMinTemp: PredTemp[i].MinTemp,
                    ForecastMaxTemp: ForecastMaxTemp[i],
                    ForecastMinTemp: ForecastMinTemp[i],
                } );
            }
            return {
                compareList: List,
                compareDiff: diff / ( List.length * 2 ),
            };
        }
        return { compareList: [], compareDiff: 0 };
    }

    var { compareList, compareDiff } = createCompareData();
    //initState?
    useEffect( () =>
    {
        getData();
    }, [] );

    const classes = useStyles();
    const fixedHeightPaper = clsx( classes.paper, classes.fixedHeight );

    return (
        
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        {/* Chart */}
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper className={clsx( classes.paper, classes.fixedHeight2 )}>
                                {state.isLoading ? (
                                    <LinearProgress />
                                ) : (
                                        <Chart title={'Forecast'} />
                                    )}
                            </Paper>
                        </Grid>
                        {/* Recent Deposits */}
                        <Grid item xs={6} md={6} lg={6}>
                            <Paper className={fixedHeightPaper}>
                                <Title>Max Temperature</Title>
                                {state.isLoading ? (
                                    <CircularProgress />
                                ) : (
                                        <TemperatureDisplay
                                            Temp={state.TodayMaxTemp}
                                            ActuallyTemp={state.ActuallyMaxTemp}
                                            TempTime={state.MaxTempTime}
                                        />
                                    )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                            <Paper className={fixedHeightPaper}>
                                <Title>Min Temperature</Title>
                                {state.isLoading ? (
                                    <CircularProgress />
                                ) : (
                                        <TemperatureDisplay
                                            Temp={state.TodayMinTemp}
                                            ActuallyTemp={state.ActuallyMinTemp}
                                            TempTime={state.MinTempTime}
                                        />
                                    )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3} lg={3}>
                            <Paper className={fixedHeightPaper}>
                                <Title>MaxTempScore</Title>
                                {state.isLoading ? (
                                    <CircularProgress />
                                ) : (
                                        <ScoreDisplay score={state.MaxTempScore} />
                                    )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3} lg={3}>
                            <Paper className={fixedHeightPaper}>
                                <Title>MinTempScore</Title>
                                {state.isLoading ? (
                                    <CircularProgress />
                                ) : (
                                        <ScoreDisplay score={state.MinTempScore} />
                                    )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3} lg={3}>
                            <Paper className={fixedHeightPaper}>
                                <Title>MaxTempPredR2Score</Title>
                                {state.isLoading ? (
                                    <CircularProgress />
                                ) : (
                                        <ScoreDisplay score={state.MaxTempPredR2Score} />
                                    )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3} lg={3}>
                            <Paper className={fixedHeightPaper}>
                                <Title>MinTempPredR2Score</Title>
                                {state.isLoading ? (
                                    <CircularProgress />
                                ) : (
                                        <ScoreDisplay score={state.MinTempPredR2Score} />
                                    )}
                            </Paper>
                        </Grid>
                        {/* Recent Orders */}
                        <Grid item xs={8} md={8} lg={8}>
                            <Paper className={clsx( classes.paper, classes.fixedHeight2 )}>
                                {state.isLoading ? (
                                    <LinearProgress />
                                ) : (
                                        <CompareChart data={compareList} title={'Compare'} />
                                    )}
                            </Paper>
                        </Grid>
                        <Grid item xs={4} md={4} lg={4}>
                            <Paper className={fixedHeightPaper}>
                                <Title>Mean error</Title>
                                {state.isLoading ? (
                                    <CircularProgress />
                                ) : (
                                        <ScoreDisplay score={compareDiff} unit={'°C'} />
                                    )}
                            </Paper>
                        </Grid>
                    </Grid>
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
    );
};

const drawerWidth = 240;

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
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${ drawerWidth }px)`,
        transition: theme.transitions.create( ['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
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
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create( 'width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        } ),
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
        height: 480,
    },
    fixedHeight3: {
        height: 220,
    },
} ) );

export default TempDashboard;