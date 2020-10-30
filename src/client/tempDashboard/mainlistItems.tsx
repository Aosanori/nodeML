import React, { useContext }from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import { FaThermometerHalf } from 'react-icons/fa';
import {IndexContext} from '../provider/indexProvider'

const MainListItems = () =>
{
  const { dispatch } = useContext( IndexContext );
  return (
    <div>
      <ListItem button onClick={() =>
      {
        
        dispatch( { type: 'CHANGE_INDEX', payload: 0 } );
      }}>
        <ListItemIcon>
          <FaThermometerHalf size={24} />
        </ListItemIcon>
        <ListItemText primary="Thermometer" />
      </ListItem>
      <ListItem button onClick={() =>
      {
        console.log( 'click' )
        dispatch( { type: 'CHANGE_INDEX', payload: 1 } );
      }}>
        <ListItemIcon>
          <WbSunnyIcon />
        </ListItemIcon>
        <ListItemText primary="Weather Forecast" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Integrations" />
      </ListItem>
    </div>
  );
}



export default MainListItems
