var app = angular.module('RpdApp', ['firebase', 'angular.filter', 'ngRoute', 'ui.bootstrap', 'gapi']).value('GoogleApp', {
    apiKey: 'AIzaSyB3X-I9Eha9q4Ddry7dqRMX7b9WI13XyWc ',
    clientId: '924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com ',
    scopes: [
      // whatever scopes you need for your app, for example:
      'https://www.googleapis.com/auth/calendar'
      // ...
    ]
  })


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

