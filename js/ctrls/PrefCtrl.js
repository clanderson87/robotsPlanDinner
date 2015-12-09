app.controller('PrefCtrl', ['$location', '$firebaseObject'],
  function($location, $firebaseObject){

    var possibleLikes = ["Italian", "American", "Mexican", "German", "Chinese"];

    var userLikes = [];

//try pushing the values of checkboxes within the partial?

    this.addToUser = function(){
      for (var i = userLikes.length - 1; i >= 0; i--) {
        ref.child("likes").child(userLikes[i]).set(userRefObj.uid);
      };;
      };
    })
