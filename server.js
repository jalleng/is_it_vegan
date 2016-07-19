'use strict';

require('express')().use(require('express').static('./build')).listen(3000);




require('dotenv').load({silent: true}); //loads environment variables defined in .env; for use in development; detects that .env exists

// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');

// const foodRouter = require('./routes/foodRoutes');

// app.use('/food', foodRouter);

// let port = process.env.PORT || 3000;
// app.listen(port, function() {
//   console.log('server up on port: ' + port);
// });



