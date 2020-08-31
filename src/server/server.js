import express from 'express';
import path from 'path';
import config from 'config';
import{ PythonShell } from 'python-shell' ;
import {logger} from './config';

const app = express();

const serverConfig = config.get('server');

app.use( express.static( path.join( './', 'dist' ) ) );

var options = {
  mode: 'text', // textもしくはjson
  pythonPath: '/Users/odatesshuu/.pyenv/versions/3.7.6/bin/python', // Python3のパスを指定しないと動かないので注意
  pythonOptions: ['-u'],
};

app.get('/api', (req, res) => {
  PythonShell.run(
    '/Users/odatesshuu/program/react-starter-master/data/temp.py',
    options,
    function(err, result) {
      if (err) throw err;
      res.send(result);
      console.log(result);
    }
  );

})

app.get( '*', function ( req, res )
{
  res.sendFile(path.join('./', 'dist', 'index.html'));
})

app.listen(serverConfig.port, ()=> {
  logger.info(`server starting -> [port] ${serverConfig.port} [env] ${process.env.NODE_ENV}`)
})
