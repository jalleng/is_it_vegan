'use strict';

// let sessionId = '767b4dda-9cce-486d-abd1-2241bd93d489';
let foodData = '';


module.exports = function(app) {
  app.controller('FoodController', function($http) {
    this.ingredients = '';
    this.allergens = [];
    this.nonVeganList = {};
    this.matchingIngredients = [];


    // Move this function to server so it has access to apikey
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
      $http({
        method: 'GET',
        url: '/search',
        headers: {
          'upc': upc
        }
      })
        .then((res) => {
          console.log('from controller', res.data);
          foodData = res.data;
          if (foodData.ingredients) {
            this.allergens = foodData.allergens;
            this.ingredients = foodData.ingredients.split(',').join('').split(' '); // removes random commas         
            this.ingredientsLower = this.ingredients.map(function(item) {           // standardize text
              return item.toLowerCase();
            });
            this.ingredientsUnique = this.removeDupes(this.ingredientsLower);       // removes duplicate items from the array
            this.returnMatches(this.ingredientsUnique);
          }
          else {
            this.matchingIngredients = ['Sorry there is no data available for this product.'];
          }
          this.matchingIngredients = this.matchingIngredients.length > 0 ? this.matchingIngredients : ['No non-vegan ingredients found'];
        }, (err) => {
          console.log(`Got error1: ${err.message}`);
        });
    }.bind(this);

    this.getList = function(callback) {
      $http.get('./nonVeganList.json')
        .then((res) => {
          this.nonVeganList = res.data;
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
    };
  });
};

