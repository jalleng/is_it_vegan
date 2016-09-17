'use strict';

// let sessionId = '767b4dda-9cce-486d-abd1-2241bd93d489';
var foodData = '';


module.exports = function(app) {
  app.controller('FoodController', function($http) {
    
    this.ingredients = '';
    this.allergens = [];
    this.veganList = {};
    this.middleList = {};
    this.nonVeganList = {};
    this.nonVeganIngredients = [];
    this.maybeIngredients = [];

    // Move this function to server so it has access to apikey
    // this.getToken = function() {
    //   $http.get(`http://api.foodessentials.com/createsession?uid=uid&devid=did&appid=isItVegan&f=json&api_key=${apiKey}`)
    //     .then((res) => {   
    //       sessionId = res.data.session_id;
    //       console.log('SessionId: ', sessionId);
    //     }, (err) => {
    //       console.log(`Got error: ${err.message}`);
    //     });
    // }.bind(this);

    this.removeDupes = function(ingredients) {
      var hasSeen = {};
      var uniques = [];
      for (var i = 0; i < ingredients.length; i++ ) {
        hasSeen[ingredients[i]] = 'seen';
      }
      for (var key in hasSeen) {
        if (hasSeen.hasOwnProperty(key)) {
          uniques.push(key);
        }
      }
      return uniques;
    };


    this.searchUpc = function(upc) {
      var self = this;
      $http({
        method: 'GET',
        url: '/upc',
        headers: {
          'upc': upc
        }
      })
        .then(function(res) {
          console.log('from controller', res.data);
          foodData = res.data;
          if (foodData.ingredients) {
            self.allergens = foodData.allergens;
            self.ingredients = foodData.ingredients.split(',').join('').split(' '); // removes random commas         
            self.ingredientsLower = self.ingredients.map(function(item) {           // standardize text
              return item.toLowerCase();
            });
            self.ingredientsUnique = self.removeDupes(self.ingredientsLower);       // removes duplicate items from the array
            self.returnMatches(self.ingredientsUnique);
          }
          else {
            self.nonVeganIngredients = ['Sorry there is no data available for this product.'];
            self.maybeIngredients = ['Sorry there is no data available for this product.'];
          }
          self.nonVeganIngredients = self.nonVeganIngredients.length > 0 ? self.nonVeganIngredients : ['No ingredients found that are non-vegan'];
          self.maybeIngredients = self.maybeIngredients.length > 0 ? self.maybeIngredients : ['No ingredients found that might be non-vegan'];
        }, function(err) {
          console.log(`Got error 1: ${err.message}`);
        });
    }.bind(this);

    this.searchText = function(raw) {
      var text = raw.split(' ').join('+').toLowerCase();
      var self = this;
      $http({
        method: 'GET',
        url: '/text',
        headers: {
          'text': text
        }
      })
        .then(function(res) {
          console.log('wat response', res);
          //response should be a list of possible matches. The user will choose a match and then we call searchUpc on the match.


        }, function(err) {
          console.log(`Got error 2: ${err.message}`);
        });
    }.bind(this);





    this.getList = function(callback) {
      var self = this;
      $http.get('./nonVeganList.json')
        .then(function(res) {
          self.nonVeganList = res.data;
          console.log('nvl', self.nonVeganList);
          if (callback) callback;
        }), function(err) {
          console.log(`Got error: ${err.message}`);
        };

      $http.get('./veganList.json')
        .then(function(res) {
          self.veganList = res.data;
          console.log('vl', self.veganList);
          if (callback) callback;
        }), function(err) {
          console.log(`Got error: ${err.message}`);
        };

      $http.get('./middleList.json')
        .then(function(res) {
          self.middleList = res.data;
          console.log('ml', self.middleList);
          if (callback) callback;
        }), function(err) {
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

