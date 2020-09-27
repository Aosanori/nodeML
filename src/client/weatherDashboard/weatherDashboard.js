import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
export const WeatherDashboard = () =>
{
    const classes = useStyles();
    return (
        <Container maxWidth="lg" className={classes.container}></Container> 
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
        height: 480,
    },
    fixedHeight3: {
        height: 220,
    },
} ) );
