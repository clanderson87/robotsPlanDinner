app.controller('PrefCtrl',
  ['$location',
  '$firebaseObject',
  'LoginFctry',

    function($location,
      $firebaseObject,
      loginFctry) {

        var ref = new Firebase("https://rpd.firebaseio.com");
        var auth = ref.getAuth();
        var user = auth.uid;

        var possibleLikes = ["Italian", "American", "Mexican", "German", "Chinese"];

        this.possibleLikes = possibleLikes;
//try pushing the values of checkboxes within the partial?

        this.removeLikes = function(index) {
          this.possibleLikes.splice(index, 1);

        };

        this.addToUser = function(){
          console.log(user);
          for (var i = possibleLikes.length - 1; i >= 0; i--) {
            ref.child("likes").child(possibleLikes[i]).set(user);
          };;
          };
      }
  ]
)
