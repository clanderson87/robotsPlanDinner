var app = angular.module('RpdApp', ['firebase', 'angular.filter', 'ngRoute', 'ui.bootstrap', 'gapi', 'cmGoogleApi']).value('GoogleApp', {
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

app.config(function (googleClientProvider) {
  googleClientProvider
    .loadPickerLibrary()
    .loadGoogleAuth({
      cookie_policy: 'single_host_origin',
      hosted_domain: 'http://192.168.33.10:8080/#/',
      fetch_basic_profile: true
    })
    .setClientId('924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com')
    .addScope('https://www.googleapis.com/auth/calendar')
    .addApi('calendar', 'v3')
    .addApi('oauth2', 'v2');
  });
