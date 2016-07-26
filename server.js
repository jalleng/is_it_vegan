'use strict';

let port = process.env.PORT || 3000;
let http = require('http');
let express = require('express');
let app = express();
require('dotenv').load({silent: true}); //loads environment variables defined in .env; for use in development; detects that .env exists
let sessionId = '767b4dda-9cce-486d-abd1-2241bd93d489';
let apiKey = process.env.FOODESSENTIALS_API_KEY;

app.use(express.static(__dirname + '/build'));

app.get('/search', function(req,res) {
  let upc = req.headers.upc;
  //let foodData = [];
  let foodData = '';
  let searchUrl = `http://api.foodessentials.com/label?u=${upc}&sid=${sessionId}&appid=isItVegan&f=json&api_key=${apiKey}`;
  
  http.get(searchUrl, function(apiResponse) {
    apiResponse.setEncoding('utf8');
    res.status(apiResponse.statusCode);

    apiResponse.on('data', function (chunk) {
      //foodData.push(chunk);
      foodData = foodData + chunk;
      // console.log('foodData', foodData);
    });
    apiResponse.on('end', function() {         //fix this. it is firing asynchronously.
      // console.log('unparsed', foodData);
      // console.log('type', Array.isArray(foodData)); 
      // let joined = foodData.join(',');
      // // console.log('buf', buf);
      // console.log('joined', joined);
      res.send(foodData);      
    });
  });


});

app.listen(port);






