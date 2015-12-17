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
        var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var userAllergies = [];
        var mealTime;
        var daysToSkip = [];
        var daysToPlan;

        this.possibleLikes = possibleLikes;
        this.possibleAllergies = possibleAllergies;
        this.userAllergies = userAllergies;
        this.mealTime = mealTime;
        this.daysArray = daysArray;
        this.daysToSkip = daysToSkip;
        this.daysToPlan =  daysToPlan;

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

        this.pushDays = function(index){
          this.daysToSkip.push(daysArray.slice(index, (index+1)).toString())
        }

        this.setToUser = function(){
          this.mealTime = this.mealTime.toISOString();
          this.daysToPlan -= (this.daysToSkip.length);
          this.daysToSkip = this.daysToSkip.toString();
          ref.child("users").child(user).child("mealTime").set(this.mealTime);
          ref.child("users").child(user).child("daysToSkip").set(this.daysToSkip);
          ref.child("users").child(user).child("daysToPlan").set(this.daysToPlan);
          $location.path('/shoppingList');
      }
    }
  ]
)
