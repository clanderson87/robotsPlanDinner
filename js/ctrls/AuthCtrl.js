app.controller('AuthCtrl', ["$firebaseAuth", "$location", "$firebaseObject",
  function($firebaseAuth, $location, $firebaseObject) {

//add login factory back?

//Add empty currentUser
  var currentUser = null;

//init the firebase
  var ref = new Firebase("https://rpd.firebaseio.com");
  var usersRef = ref.child('users');

//c&p from firebase, wrapped in function
  this.login = function(){
      ref.authWithOAuthPopup("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          userRefObj = authData;
          userRefObj.username = authData.google.displayName;
          ref.child("users").child(authData.uid).set(userRefObj);
        };
      }, {
        scope: 'https://www.googleapis.com/auth/calendar'
        }
      )
      $location.path('/pref1');
  };

//end Controller Function
}]);
