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
                //deals with leapyears
                if(y % 4 === 0 && y % 100 !== 0) {
                  d -= 28;
                  m += 1;
                } else{
                  d -= 28;
                  m += 1;
                }
              } else if(m === 4 || m === 6 || m === 9 || m === 11) {
                //deals with April, June, September and November
                if(d > 30){
                  d -= 30;
                  m += 1;
              }
              }
              return d, m;
            } else {
              return d, m;
            };
          }

        // empty variables:
        var userAllergies = [];
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
        this.mealTime = mealTime;
        this.mealTimeEnd = mealTimeEnd;
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
