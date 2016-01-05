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
        var possibleLikes = ["Italian", "American", "Mexican", "German", "Chinese", "French", "English", "Irish", "Southwestern", "New England", "Southern", "Korean", "BBQ"];
        var possibleAllergies = ["Peanut", "Shellfish", "Gluten"]
        var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        // var possibleHatred = ["I hate", "I loathe", ]

        // empty variables:
        var userAllergies = [];
        var hateThese = [];
        var mealTime = new Date();
          mealTime.setMinutes(30);
          mealTime.setSeconds(00);
          mealTime.setMilliseconds(00);

        var mealTimeEnd = new Date();
        var daysToSkip = [];
        var daysToPlan;


        this.possibleLikes = possibleLikes;
        this.possibleAllergies = possibleAllergies;
        this.userAllergies = userAllergies;
        this.hateThese = hateThese;
        this.mealTime = mealTime;
        this.mealTimeEnd = mealTimeEnd;
        this.daysArray = daysArray;
        this.daysToSkip = daysToSkip;
        this.daysToPlan =  daysToPlan;

        this.resetLikes = function() {
          // this.possibleLikes = ["Italian", "American", "Mexican", "German", "Chinese", "French", "English", "Irish", "Southwestern", "New England", "Southern", "Korean", "BBQ"];
          // this.hateThese = [];
          for (var i = hateThese.length - 1; i >= 0; i--) {
            this.possibleLikes.push(hateThese[i])
            this.hateThese.splice([i], 1);
          };
        }

        this.removeLikes = function(index) {
          this.hateThese.push(possibleLikes[index]);
          this.possibleLikes.splice(index, 1);
        };

        this.undoHate = function(index) {
          this.possibleLikes.push(hateThese[index]);
          this.hateThese.splice(index, 1)
        }

        this.pushAllergies = function(index) {
          this.userAllergies.push(possibleAllergies.slice(index, (index+1)).toString())
        };

        this.addLikesToUser = function(){
          console.log(user);
          for (var i = possibleLikes.length - 1; i >= 0; i--) {
            ref.child("likes").child(possibleLikes[i]).set(user);
          };
          $location.path('/fire');
        };

        this.addAllergiesToUser = function(){
          for (var i = userAllergies.length - 1; i >= 0; i--) {
            ref.child("allergies").child(userAllergies[i]).set(user);
          };
          $location.path('/fire');
        }

        this.pushDays = function(index){
          this.daysToSkip.push(daysArray.slice(index, (index+1)).toString())
        }

        this.setToUser = function(){
          this.mealTimeEnd.setHours((mealTime.getHours() + 1));
          this.mealTimeEnd.setMinutes((mealTime.getMinutes()));
          this.mealTimeEnd.setSeconds(00);
          // console.log(this.mealTimeEnd)
          console.log(this.mealTime)
          console.log(this.mealTimeEnd);
          this.mealTimeEnd = this.mealTimeEnd.valueOf();
          this.mealTime = this.mealTimeEnd.valueOf();
          this.daysToPlan -= (this.daysToSkip.length);
          this.daysToSkip = this.daysToSkip.toString();
          ref.child("mealTime").child(this.mealTime).set(user);
          ref.child("mealTimeEnd").child(this.mealTimeEnd).set(user);
          ref.child("daysToSkip").child(this.daysToSkip).set(user);
          ref.child("daysToPlan").child(this.daysToPlan).set(user);
          $location.path('/shoppingList');
      }
    }
  ]
)
