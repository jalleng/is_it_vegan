require('dotenv').load({silent: true}); //loads environment variables defined in .env; for use in development; detects that .env exists

var express = require('express');
var app = express();
var requestInfo = require(__dirname + '/scripts/nutritionix.js')




//process.env.APP_SECRET = process.env.APP_SECRET || 'for the love of zeus! Change Me!';

//app.use(express.static(__dirname + '/build'));

//var upcRouter = require(__dirname + '/routes/upc_routes');
// var nutritionixRouter = require(__dirname + '/routes/nutritionix_routes');

// app.use('/', upcRouter);
// app.use('/', nutritionixRouter);

// app.get('/', function (req, res) {
//   res.send('hello world');
// });

// app.get('*', function(request, response) {
//   console.log('New request:', request.url);
//   response.sendFile('index.html', { root: '.' });
// });

app.get('/', function(req, res) {
  res.sendFile('index.html', { root: '.'});
});

app.get('/search', function(req, res) {
  res.json(requestInfo());
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
