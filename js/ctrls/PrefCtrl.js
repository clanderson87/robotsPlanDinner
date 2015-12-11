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
        var possibleAllergies = ["Peanut", "Shellfish", "Gluten"]
        var userAllergies =[];

        this.possibleLikes = possibleLikes;
        this.possibleAllergies = possibleAllergies;
        this.userAllergies = userAllergies;
//try pushing the values of checkboxes within the partial?

        this.removeLikes = function(index) {
          this.possibleLikes.splice(index, 1);
        };

        this.pushAllergies = function(index) {
          this.userAllergies.push(possibleAllergies.slice(index, (index+1)).toString())
        };

        this.addLikesToUser = function(){
          console.log(user);
          for (var i = possibleLikes.length - 1; i >= 0; i--) {
            ref.child("likes").child(possibleLikes[i]).set(user);
          };
          $location.path('/pref2');
          };

        this.addAllergiesToUser = function(){
          for (var i = userAllergies.length - 1; i >= 0; i--) {
            ref.child("allergies").child(userAllergies[i]).set(user);
          };
          $location.path('/pref3');

        }
      }
  ]
)
