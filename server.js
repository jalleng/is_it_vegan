require('dotenv').load({silent: true}); //loads environment variables defined in .env; for use in development; detects that .env exists

var express = require('express');
var app = express();

// var nutritionix = require('nutritionix')({
//     appId: process.env.NUTRITIONIX_APP_ID,
//     appKey: process.env.NUTRITIONIX_API_KEY
// }, false);


//process.env.APP_SECRET = process.env.APP_SECRET || 'for the love of zeus! Change Me!';

//app.use(express.static(__dirname + '/build'));

//var upcRouter = require(__dirname + '/routes/upc_routes');
// var nutritionixRouter = require(__dirname + '/routes/nutritionix_routes');

// app.use('/', upcRouter);
// app.use('/', nutritionixRouter);

// app.get('/', function (req, res) {
//   res.send('hello world');
// });

app.get('*', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('index.html', { root: '.' });
});

// app.post('/search', function (req, res) {
//   console.log(nutritionix);
//       nutritionix.item({
//           upc: 52200004265
//       }, function(err, item) {
//           if (err) {
//               return handleError(err, res);
//           }
//           res.json(item);
//       });
// });
// app.use(function(req, res) {
//   res.status(404).send('Page not found');
// });

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server up on port: ' + port);
});
