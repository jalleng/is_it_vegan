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
    this.matchingIngredients = [];

    this.getToken = function() {
      $http.get(`http://api.foodessentials.com/createsession?uid=uid&devid=did&appid=isItVegan&f=json&api_key=${apiKey}`)
        .then((res) => {   
          sessionId = res.data.session_id;
          console.log('SessionId: ', sessionId);
        }, (err) => {
          console.log(`Got error: ${err.message}`);
        });
    }.bind(this);

    this.removeDupes = function(ingredients) {
      let hasSeen = {};
      let uniques = [];
      for (let i = 0; i < ingredients.length; i++ ) {
        hasSeen[ingredients[i]] = 'seen';
      }
      for (let key in hasSeen) {
        if (hasSeen.hasOwnProperty(key)) {
          uniques.push(key);
        }
      }
      return uniques;
    };

    this.search = function(upc) {
      $http.get(`http://api.foodessentials.com/label?u=${upc}&sid=${sessionId}&appid=isItVegan&f=json&api_key=${apiKey}`)
        .then((res) => {
          foodData = res.data;
          this.allergens = foodData.allergens;
          this.ingredients = foodData.ingredients.split(',').join('').split(' '); // removes random commas         
          this.ingredientsLower = this.ingredients.map(function(item) {           // standardize text
            return item.toLowerCase();
          });
          this.ingredientsUnique = this.removeDupes(this.ingredientsLower);       // removes duplicate items from the array
          console.log('Unique', this.ingredientsUnique);   
          this.returnMatches(this.ingredientsUnique);
        }, (err) => {
          console.log(`Got error: ${err.message}`);
        });
    }.bind(this);

    this.getList = function(callback) {
      $http.get('./nonVeganList.json')
        .then((res) => {
          this.nonVeganList = res.data;
          console.log ('nonVeganList: ', this.nonVeganList);
          if (callback) callback;
        }), (err) => {
          console.log(`Got error: ${err.message}`);
        };
    }.bind(this);

    this.getList();

    this.filter = function(ingredient) {
      if (ingredient in this.nonVeganList){
        return true;
      }
    };

    this.returnMatches = function(ingredients) {
      this.matchingIngredients = ingredients.filter(this.filter, this);
      console.log('Matching Ingredients!', this.matchingIngredients);
    };
  });
};

// **************************************** 

//sample upc = 029000073258


// ["PEANUTS", " CONTAINS 2% OR LESS OF SEA SALT", " SPICES (CONTAINS CELERY)", " DRIED ONION", " DRIED GARLIC", " PAPRIKA", " NATURAL FLAVOR", " SUGAR", " CORNSTARCH", " GELATIN", " TORULA YEAST", " MALTODEXTRIN", " DRIED CORN SYRUP."]

// Object {
// albumen: "The protein component of egg whites", 
// albumin: "The protein component of egg whites", 
// acetate: "Can come from fish liver oil", 
// acetylated_hydrogenated_lard_glyceride: "From ", 
// adrenaline: "From the adrenals of hogs, cattle, and sheep",

// acetate:"Can come from fish liver oil",
// acetylated_hydrogenated_lard_glyceride:"From ",
// adrenaline:"From the adrenals of hogs, cattle, and sheep",
// };