app.controller('PrefCtrl', ['$location', '$firebaseObject',
  function($location, $firebaseObject) {

    this.ref = new Firebase("https://rpd.firebaseio.com");

    this.possibleLikes = ["Italian", "American", "Mexican", "German", "Chinese"];


//try pushing the values of checkboxes within the partial?

    this.removeLikes = function(index) {
      this.possibleLikes.splice(index, 1);
    };

    this.addToUser = function(){
      for (var i = possibleLikes.length - 1; i >= 0; i--) {
        ref.child("likes").child(possibleLikes[i]).set(uid);
      };;
      };
    }])
