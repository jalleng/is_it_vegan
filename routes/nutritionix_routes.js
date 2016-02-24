var express = require('express');
var jsonParser = require('body-parser').json();

var handleError = require(__dirname + '/../lib/handle_error');

var nutritionix = require('nutritionix')({
    appId: process.env.NUTRITIONIX_APP_ID,
    appKey: process.env.NUTRITIONIX_API_KEY
}, false);


var nutritionixRoute = module.exports = exports = express.Router();


nutritionixRoute.post('/search', function(req, res) {
    console.log(nutritionix);
    nutritionix.item({
        upc: 52200004265
    }, function(err, item) {
        if (err) {
            return handleError(err, res);
        }
        res.json(item);
    });


  //TODO: take req.upc, use Nutritionix API
  //TODO: scan ingredients for animal-products
});

// app.get('/', function (req, res) {
//   res.render('index', {});
// });
