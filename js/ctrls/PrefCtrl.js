app.controller('PrefCtrl',
  ['$location',
  '$firebaseObject',
  'LoginFctry',

    function($location,
      $firebaseObject,
      loginFctry) {

        //firebase shit
        var ref = new Firebase("https://rpd.firebaseio.com");
        var auth = ref.getAuth();
        var user = auth.uid;

        // possible arrays
        var possibleLikes = ["Italian", "American", "Mexican", "German", "Chinese"];
        var possibleAllergies = ["Peanut", "Shellfish", "Gluten"]
        var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        //date bullshit
        var date = new Date();
          var d = date.getDate();
          var m = date.getMonth() + 1;
          var y = date.getFullYear();
          var rndm = (d + (Math.floor(Math.random()* 7) + 1))
          var rndmDate = function(){
            if(d > 28) {

              //deals with february
              if(m === 2){
                if(y % 4 === 0) {
                  d -= 29;
                  m += 1;
                } else{
                  d -= 28;
                  m += 1;
                }
              } else if(m === 4 || m === 6 || m === 9 || m === 11) {
                //deals with April, June, September and November
                d -= 30;
                m+= 1;
              }
            }
        // empty variables:
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
          this.mealTime = this.mealTime.setDate(d);
          this.mealTime = this.mealTime.
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
