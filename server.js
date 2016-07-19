'use strict';

let port = process.env.PORT || 3000;
let express = require('express');
let app = express();

app.use(express.static(__dirname + '/build'));
app.listen(port);
// require('express')().use(require('express').static('./build')).listen(port);




// require('dotenv').load({silent: true}); //loads environment variables defined in .env; for use in development; detects that .env exists

// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');

// const foodRouter = require('./routes/foodRoutes');

// app.use('/food', foodRouter);

// let port = process.env.PORT || 3000;
// app.listen(port, function() {
//   console.log('server up on port: ' + port);
// });



