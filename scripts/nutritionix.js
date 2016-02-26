


  var request = require('request');
  var appId = process.env.NUTRITIONIX_APP_ID;
  var appKey = process.env.NUTRITIONIX_API_KEY;
  var urlBase = 'https://api.nutritionix.com/v1_1/item?';

  var upc = '37014242478';

  var queryString = urlBase +
    'upc=' + upc +
    '&appId=' + appId +
    '&appKey=' + appKey;

  module.exports = function(query,params,cb) {
    request.get({url:queryString}, function(err,response) {
        console.log("Sweet data", response.body);
     })
  };








