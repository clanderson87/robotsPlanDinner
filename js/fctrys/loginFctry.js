app.factory('LoginFctry', ['$firebaseAuth', '$firebaseObject', '$location',
  function ($firebaseAuth, $firebaseObject, $location) {

   var ref = new Firebase("https://rpd.firebaseio.com");
   var usersRef = ref.child('users');
   var userRefObj = {};

  return {
//c&p from firebase, wrapped in function

  login: function(){
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
  }

//getAuth();


}
}])
