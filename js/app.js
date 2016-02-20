var app = angular.module('RpdApp', ['firebase', 'angular.filter', 'ngRoute', 'ui.bootstrap'])

//BELOW IS CRITICAL FOR ANGuLAR/ GOOGLE INTEGRATION

var init = function() {
  window.initGapi();
}

app.controller('MainController', function($scope, $window, gapiService, $location) {

  this.callback = function(){
    console.log("This happened in the controller");
  }

  var postInitiation = function() {
    gapi.client.load('calendar', 'v3', callback);
    // load all your assets
  }
  $window.initGapi = function() {
    gapiService.initGapi(postInitiation);
  }
});

app.service('gapiService', function($location) {
  this.callback = function(){
    console.log("this happened in the service");
  }

  this.initGapi = function(postInitiation) {
  gapi.client.load('calendar', 'v3', this.callback)
  }
});

//CLOSE CRITICAL GAPI INTEGRATION

//Setting Up routes
app.config(['$routeProvider', function($routeProvider){

  //route to prompt sign into firebase with google
  $routeProvider
    .when('/', {
      templateUrl: 'partials/splash.html',
      controller: 'MainController as mainCtrl'
    })
    .when('/login', {
      templateUrl: 'partials/main.html',
      controller: 'AuthCtrl as authCtrl'
    })
  //route for 'Likes' array page.
    .when('/pref1', {
      templateUrl: 'partials/likes.html',
      controller: 'PrefCtrl as prefCtrl'
    })
  //route for 'allergies' array page
    .when('/pref2', {
      templateUrl: 'partials/allergies.html',
      controller: 'PrefCtrl as prefCtrl'
    })
  //route for 'advanced Options' array page
    .when('/pref3', {
      templateUrl: 'partials/options.html',
      controller: 'PrefCtrl as prefCtrl'
    })
  //route for ajax (f2f and google) logic
    .when('/fire', {
      templateUrl: 'partials/fireTemp.html',
      controller: 'RecipeCtrl as recipeCtrl'
    })
  //route for shopping list
    .when('/list', {
      templateUrl: 'partials/list.html',
      controller: 'RecipeCtrl as recipeCtrl'
    })
    .otherwise({ redirectTo: '/shoppingList' });

}]);
