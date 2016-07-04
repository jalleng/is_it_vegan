'use strict';

// const apiKey = process.env.FOODESSENTIALS_API_KEY;
const apiKey = '';
let sessionId = 'b733cbf6-8508-44f5-a320-3247745e728b';
let foodData = '';



module.exports = function(app) {
  app.controller('FoodController', function($http) {
    this.ingredients = '';
    this.allergens = [];

    this.getToken = function() {
      $http.get(`http://api.foodessentials.com/createsession?uid=uid&devid=did&appid=isItVegan&f=json&api_key=${apiKey}`)
        .then((res) => {   
          sessionId = res.data.session_id;
          console.log('SessionId: ', sessionId);
        }, (err) => {
          console.log(`Got error: ${err.message}`);
        });
    }.bind(this);


    this.search = function(upc) {
      $http.get(`http://api.foodessentials.com/label?u=${upc}&sid=${sessionId}&appid=isItVegan&f=json&api_key=${apiKey}`)
        .then((res) => {
          foodData = res.data;
          this.ingredients = foodData.ingredients;
          this.allergens = foodData.allergens;

          console.log('foodData', foodData);
          console.log('ingredients', this.ingredients);
          console.log('allergens', this.allergens);

        }, (err) => {
          console.log(`Got error: ${err.message}`);
        });
    }.bind(this);

  });
};

// **************************************** 

//sample upc = 029000073258



