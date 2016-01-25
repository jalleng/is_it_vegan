require('dotenv').load({silent: true}); //loads environment variables defined in .env; for use in development; detects that .env exists

var express = require('express');
var app = express();

process.env.APP_SECRET = process.env.APP_SECRET || 'for the love of zeus! Change Me!';

app.use(express.static(__dirname + '/build'));

var upcRouter = require(__dirname + '/routes/upc_routes');

app.use('/', upcRouter);

app.use(function(req, res) {
  res.status(404).send('Page not found');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server up on port: ' + port);
});
