app.controller('AuthCtrl', ["$firebaseAuth", "$location", "$firebaseObject",
  function($firebaseAuth, $location, $firebaseObject) {

//add login factory back?

//init the firebase
  var ref = new Firebase("https://rpd.firebaseio.com");

//c&p from firebase, wrapped in function
  this.login = function(){
    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
       console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $location.path("/pref1");
      }
  });
}

//end Controller Function
}]);
