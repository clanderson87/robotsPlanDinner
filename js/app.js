var app = angular.module('RpdApp', ['firebase', 'angular.filter', 'ngRoute', 'ui.bootstrap'])

var init = function() {
  window.initGapi();
}

app.controller('MainController', function($scope, $window, gapiService) {
  var postInitiation = function() {
    // load all your assets
  }
  $window.initGapi = function() {
    gapiService.initGapi(postInitiation);
  }
});

app.service('gapiService', function() {
  this.initGapi = function(postInitiation) {
    gapi.client.load('calendar', 'v3');
  }
});

//Setting Up routes
app.config(['$routeProvider', function($routeProvider){

  //route to prompt sign into firebase with google
  $routeProvider
    .when('/', {
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
  //route for shopping list
    .when('/shoppingList', {
      templateUrl: 'partials/list.html',
      controller: 'RecipeCtrl as recipeCtrl'
    })
    .otherwise({ redirectTo: '/shoppingList' });

}]);
