'use strict';

// let sessionId = '767b4dda-9cce-486d-abd1-2241bd93d489';
let foodData = '';


module.exports = function(app) {
  app.controller('FoodController', function($http) {
    
    this.ingredients = '';
    this.allergens = [];
    this.veganList = {};
    this.middleList = {};
    this.nonVeganList = {};
    this.nonVeganIngredients = ['katie', 'alice'];
    this.maybeIngredients = [];

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
            this.nonVeganIngredients = ['Sorry there is no data available for this product.'];
            this.maybeIngredients = ['Sorry there is no data available for this product.'];
          }
          this.nonVeganIngredients = this.nonVeganIngredients.length > 0 ? this.nonVeganIngredients : ['No ingredients found that are non-vegan'];
          this.maybeIngredients = this.maybeIngredients.length > 0 ? this.maybeIngredients : ['No ingredients found that might be non-vegan'];
        }, (err) => {
          console.log(`Got error1: ${err.message}`);
        });
    }.bind(this);

    this.getList = function(callback) {
      $http.get('./nonVeganList.json')
        .then((res) => {
          this.nonVeganList = res.data;
          console.log('nvl', this.nonVeganList);
          if (callback) callback;
        }), (err) => {
          console.log(`Got error: ${err.message}`);
        };

      $http.get('./veganList.json')
        .then((res) => {
          this.veganList = res.data;
          console.log('vl', this.veganList);
          if (callback) callback;
        }), (err) => {
          console.log(`Got error: ${err.message}`);
        };

      $http.get('./middleList.json')
        .then((res) => {
          this.middleList = res.data;
          console.log('ml', this.middleList);
          if (callback) callback;
        }), (err) => {
          console.log(`Got error: ${err.message}`);
        };
    }.bind(this);

    this.getList();

    this.nonVeganFilter = function(ingredient) {
      if (ingredient in this.nonVeganList){
        return true;
      }
    };

    this.maybeFilter = function(ingredient) {
      if (ingredient in this.maybeIngredients){
        return true;
      }
    };

    this.returnMatches = function(ingredients) {
      this.nonVeganIngredients = ingredients.filter(this.nonVeganFilter, this);
      this.maybeIngredients = ingredients.filter(this.maybeFilter, this);
    };
  });
};

