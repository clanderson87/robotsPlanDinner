app.controller('PrefCtrl',
  ["$location",
  "refFctry",
  "loginFctry",

    function($location,
      ref,
      auth) {

        //alising this
        var vm = this;


        //firebase shit
        var firebaseRef = ref.ref
        var authData = auth.$getAuth();
        var user = authData.uid;

        if (authData) {
          console.log("Logged in as:", authData.uid);
        } else {
          console.log("Logged out");
        };

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

        //linking to angular
        vm.possibleLikes = possibleLikes;
        vm.possibleAllergies = possibleAllergies;
        vm.userAllergies = userAllergies;
        vm.hateThese = hateThese;
        vm.mealTime = mealTime;
        vm.mealTimeEnd = mealTimeEnd;
        vm.daysArray = daysArray;
        vm.daysToSkip = daysToSkip;
        vm.daysToPlan =  daysToPlan;


        //resets possibleLikes array
        vm.resetLikes = function() {
          for (var i = hateThese.length - 1; i >= 0; i--) {
            vm.possibleLikes.push(hateThese[i])
            vm.hateThese.splice([i], 1);
          };
        }

        //deletes from possibleLikes array, pushes into hateThese
        vm.removeLikes = function(index) {
          vm.hateThese.push(possibleLikes[index]);
          vm.possibleLikes.splice(index, 1);
        };

        //reverses above, pushes from hateThese into possibleLikes
        vm.undoHate = function(index) {
          vm.possibleLikes.push(hateThese[index]);
          vm.hateThese.splice(index, 1)
        }

        //allergy code - not supportted in v1.0
        /*vm.pushAllergies = function(index) {
          vm.userAllergies.push(possibleAllergies.slice(index, (index+1)).toString())
        };*/

        //adds likes to user in firebase, also sets hates to null value
        vm.addLikesToUser = function(){
          console.log(user);
          for (var i = possibleLikes.length - 1; i >= 0; i--) {
            firebaseRef.child("likes").child(possibleLikes[i]).set(user);
          };
          for (var j = hateThese.length -1 ; j >=0; j--){
            firebaseRef.child("likes").child(hateThese[j]).set(null);
          };
          $location.path('/fire');
        };

        //adds allergies to user, not suppported in v1.0
        /*vm.addAllergiesToUser = function(){
          for (var i = userAllergies.length - 1; i >= 0; i--) {
            firebaseRef.child("allergies").child(userAllergies[i]).set(user);
          };
          $location.path('/fire');
        }*/

        //code for setting mealTimes, not supported in v1.0

        /*vm.pushDays = function(index){
          vm.daysToSkip.push(daysArray.slice(index, (index+1)).toString())
        }*/

        //setting all the custom mealTimes - not supported in v1.0
        /*vm.setToUser = function(){
          vm.mealTimeEnd.setHours((mealTime.getHours() + 1));
          vm.mealTimeEnd.setMinutes((mealTime.getMinutes()));
          vm.mealTimeEnd.setSeconds(00);
          // console.log(vm.mealTimeEnd)
          console.log(vm.mealTime)
          console.log(vm.mealTimeEnd);
          vm.mealTimeEnd = vm.mealTimeEnd.valueOf();
          vm.mealTime = vm.mealTimeEnd.valueOf();
          vm.daysToPlan -= (vm.daysToSkip.length);
          vm.daysToSkip = vm.daysToSkip.toString();
          firebaseRef.child("mealTime").child(vm.mealTime).set(user);
          firebaseRef.child("mealTimeEnd").child(vm.mealTimeEnd).set(user);
          firebaseRef.child("daysToSkip").child(vm.daysToSkip).set(user);
          firebaseRef.child("daysToPlan").child(vm.daysToPlan).set(user);
          $location.path('/shoppingList');
      }*/
    }
  ]
)
