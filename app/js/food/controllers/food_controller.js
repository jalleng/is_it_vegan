'use strict';

// const apiKey = process.env.FOODESSENTIALS_API_KEY;
const apiKey = '';
let sessionId = '767b4dda-9cce-486d-abd1-2241bd93d489';
let foodData = '';
// let nonVeganList = require('.../data/scrap.js');
// console.log (nonVeganList);

module.exports = function(app) {
  app.controller('FoodController', function($http) {
    this.ingredients = '';
    this.allergens = [];
    this.nonVeganList = {};

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

    this.getList = function(callback) {
      $http.get('./nonVeganList.json')
        .then((res) => {
          console.log ('res: ', res.data);
          this.nonVeganList = res.data;
          console.log ('nonVeganList: ', this.nonVeganList);
          if (callback) callback;
        }), (err) => {
          console.log(`Got error: ${err.message}`);
        };
    }.bind(this);

    this.getList();

    this.compare = function(ingredients, nonVeganList) {

    };

  });
};

// **************************************** 

//sample upc = 029000073258



