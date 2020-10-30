import express from 'express';
import path from 'path';
import config from 'config';
import { PythonShell } from 'python-shell';
//import {logger} from './config.js';
import cron from 'node-cron' ;
import cors from 'cors' 

const app = express();
app.use( cors() );
const serverConfig :any = config.get('server');

app.use( express.static( path.join( './', 'dist' ) ) );



const options:any= {
  mode: 'text', // textもしくはjson
  pythonPath:
    '/Users/odatesshuu/.pyenv/versions/3.8.5/bin/python',
  pythonOptions: ['-u'],
};

cron.schedule( '0 59 23 * * *', () =>
{
  PythonShell.run(
    '/Users/odatesshuu/program/react-starter-master/data/csv_writing.py',
    options,
    function(err, result) {
      if (err) throw err;
      console.log(result);
    }
  );
});

app.get( '/api', ( req, res ) =>
{
  PythonShell.run(
    '/Users/odatesshuu/program/react-starter-master/data/temp.py',
    options,
    function ( err, result )
    {
      if ( err ) throw err;
      res.send( result );
      console.log( result );
    }
  );

} );

app.get('/weather', (req, res) => {
  PythonShell.run(
    '/Users/odatesshuu/program/react-starter-master/data/weather_forecast.py',
    options,
    function(err, result) {
      if (err) throw err;
      res.send(result);
      console.log(result);
    }
  );
});

app.get( '*', function ( req, res )
{
  res.sendFile( path.join( __dirname + './', 'dist', 'index.html' ) );
})

app.listen(process.env.PORT || serverConfig.port , () => {
  //logger.info(
   // `server starting -> [port] ${serverConfig.port} [env] ${process.env.NODE_ENV}`
 // );
});
