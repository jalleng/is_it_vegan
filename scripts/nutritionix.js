


  var request = require('request');
  var appId = process.env.NUTRITIONIX_APP_ID;
  var appKey = process.env.NUTRITIONIX_API_KEY;
  var urlBase = "https://api.nutritionix.com/v1_1/search/mcdonalds?";





  var queryString = 'https://api.nutritionix.com/v1_1/search/mcdonalds?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=' + appId + '&appKey=' + appKey ;




  module.exports = function(query,params,cb) {
    request.get({url:queryString}, function(err,response) {
        console.log("Sweet data", response.body);
     })
  };










