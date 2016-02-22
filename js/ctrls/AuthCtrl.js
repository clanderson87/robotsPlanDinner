app.controller('AuthCtrl', ["$location", "refFctry",
  function($location, ref) {

    //aliasing this
    var vm = this;

    //Add empty currentUser
    var currentUser = null;

    //init the firebase with refFctry
    var loginRef = ref.ref
    var usersRef = loginRef.child('users');

    // c&p from firebase, wrapped in function
    vm.login = function(){
        loginRef.authWithOAuthPopup("google", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            userRefObj = authData;
            userRefObj.username = authData.google.displayName;
            ref.child("users").child(authData.uid).set(userRefObj);
          };
        }, {
          scope: 'https://www.googleapis.com/auth/calendar',
          }
        )
        $location.path('/pref1');
    };

//end Controller Function
}]);
