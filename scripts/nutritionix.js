

var item = {};

item.requestInfo = function() {
  $.get("https://api.nutritionix.com/v1_1/search/mcdonalds?",
    {
      "appId" : "",
      "appKey" : "",
      "fields" : "item_name,brand_name"
    }
  ).done(function(data) {
    console.log("sweet sweet data", data);
  });

}




