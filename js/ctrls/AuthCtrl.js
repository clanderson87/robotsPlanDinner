app.controller('AuthCtrl', ["$firebaseAuth", "$location", "$firebaseObject",
  function($firebaseAuth, $location, $firebaseObject) {

//add login factory back?

//Add empty currentUser
  var currentUser = null;
  var username = "";

//init the firebase
  var ref = new Firebase("https://rpd.firebaseio.com");

//c&p from firebase, wrapped in function
  this.login = function(){
    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
       console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData)
        username = authData.google.displayName;
        console.log(username);
        // $location.path("/pref1");
        var userRef = new Firebase("https://rpd.firebaseio.com/users/" + authData.uid);
        var userRefObj = $firebaseObject(userRef);

                //promise that is resolved once the data is available from firebase
        userRefObj.$loaded()
          .then(function(){

            currentUser = userRefObj;
            currentUser.displayName = username;
            console.log(currentUser);
            console.log("currentUser set as ", currentUser);
          });

        $location.path("/pref1");

      }
        //Fires this code:

              //end promise

              //current user set to the auth data
                // end set user}
      {
      scope: "https://www.googleapis.com/auth/calendar"
    }
  });
}

//end Controller Function
}]);
