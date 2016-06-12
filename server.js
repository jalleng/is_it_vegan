'use strict';

require('dotenv').load({silent: true}); //loads environment variables defined in .env; for use in development; detects that .env exists
const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const foodRouter = express.Router();

const apiKey = process.env.FOODESSENTIALS_API_KEY;

let sessionId; 

app.use('/food', foodRouter);

foodRouter.get('/session', (req, res) => {
  http.get(`http://api.foodessentials.com/createsession?uid=someuid&devid=somedevid&appid=someappid&f=json&api_key=${apiKey}`, (res) => {
    console.log(`Got response: ${res.statusCode}`);
    sessionId = (res.headers['set-cookie'][0]).split(';')[0].split('=')[1];
    console.log('sessionId', sessionId);
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
  res.end();
});

let port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server up on port: ' + port);
});



