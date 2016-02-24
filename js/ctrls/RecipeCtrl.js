app.controller('RecipeCtrl',
  [
  '$firebaseArray',
  '$http',
  '$location',
  'refFctry',
  'loginFctry',

    function(
      $firebaseArray,
      $http,
      $location,
      ref,
      auth) {

        //aliasing this
        var vm = this;

        //Firebase code
        var firebaseRef = ref.ref
        var authData = auth.$getAuth();
        var user = authData.uid;

        if (authData) {
          console.log("Logged in as:", authData.uid);
        } else {
          console.log("Logged out");
        };

        var daysToPlan = firebaseRef.child("daysToPlan").orderByValue().equalTo(user);
        var allergyRef = firebaseRef.child("allergies").orderByValue().equalTo(user);
        var allergyArray = $firebaseArray(allergyRef);
        var likesRef = firebaseRef.child("likes").orderByValue().equalTo(user);
        var likesArray = $firebaseArray(likesRef);

        //cooking terms and substitutions
        var cookingTerms = /(\(|\)|\d+[\/.]\d+?\s|[0-9]|may\s|need\s|need|additional\s|additional|depending\s|depending|texture\s|texture|we\s|use\s|use|consistancy\s|consistancy|time\s|time|you\s|you|add\s|add|at\s|for\s|for|the\s|the|room\s|temperature\s|temperature|tablespoons\s|tablespoon\s|tbsp\s|tsp\s|teaspoons\s|teaspoon\s|cups\s|cup\s|chopped\s|chopped|sliced\s|sliced|pounds\s|pounds|pound\s|pound|pinch\s|diced\s|diced|thinly\s|thinly|thin\s|thin|fluid\s|fluid|rinsed\s|rinsed|jars\s|jar\s|ounces\s|ounce\s|\d\ounces\s|\d\ounce\s|ounces\s|ounces|whole\s|whole|minced\s|minced|drained\s|drained|thawed\s|thawed|half\s|half|inch\s|inch|heaped\s|heaped|lbs\s|lb\s|toasted\s|toasted|ground\s|ground|finely\s|quartered\s|quartered|and\s|of\s|lightly\s|packed\s|packed|roughly\s|peeled\s|about\s|dusting\s|deseeded\s|deseeded|seeded\s|seeded|divided\s|\s\(up\sto\syou\)|for\schopping\s|large\smezzaluna\s|Special\sequipment:\s|\d{3}g\s|\d{2}g\s|\dg\s|grams\s|gram\s|milliliters\s|milliliter\s|millilitres\s|millilitre\s|ml\s|\d\s|,)/gi;
        var subst = '';

        //Opening Empty Variables
        var reallyFinalRecipeArray = []
        var finalRecipeArray = [];
        var firstItemArray = [];
        var finalItemArray = [];
        var calId = "";
        var startTime = [];
        var endTime = [];
        var loading = [];
        var bestRids = [];

        //assigning variables to angular scope
        vm.reallyFinalRecipeArray = reallyFinalRecipeArray;
        vm.finalRecipeArray = finalRecipeArray;
        vm.firstItemArray = firstItemArray;
        vm.finalItemArray = finalItemArray;
        vm.endTime = endTime;
        vm.loading = loading;
        vm.bestRids = bestRids;

        //setting a weeks worth of start and end times, edit for loops for more dates
        //for loop and getRecipes.while loop have to have same number of iterations!
        // IIFE called on ctrl load.

        //make this user settable, perhaps in prefCtrl?
        var setDates = function(){
          for(var p = 1; p < 8; p++){
            var d = new Date();
            var rDate = ((d.getDate()) + p)
            d.setDate(rDate);
            d.setHours(18);
            d.setMinutes(00);
            d.setSeconds(00);
            console.log(d)
            startTime.push(d.toISOString());
            d.setHours(19);
            console.log(d)
            endTime.push(d.toISOString());
          }
        }();

        // gets list of cals from google, IIFE fires on ctrl load
        var getCalList = function(){
        //setting empty variables for calendar ops
          var summaryArray = [];
          var getCalId = function(){
            if (summaryArray.indexOf('RobotPlannedDinners') >= 0) {
                var v = (summaryArray.indexOf('RobotPlannedDinners') - 1);
                calId = summaryArray[v].toString();
                console.log(calId);
            } else {
              var requestCals = gapi.client.calendar.calendars.insert({'summary':'RobotPlannedDinners', 'description': "meal planning for the lazy type-A's in all of us"}).execute(function(respC){
                  console.log(respC);
                  calId = respC.id;
                  console.log(calId)
              });
            }
          };
          //getting calendars
          gapi.client.calendar.calendarList.list().execute(function(respLC){
            console.log(respLC);
            respLC.items.forEach(function(object){
              summaryArray.push(object.id, object.summary)
              });
            console.log(summaryArray);
            getCalId();
          });
        };

        // removes an item from the shopping list
        vm.removeItem = function(index){
          vm.firstItemArray.splice(index, 1);
        }

        //removes a recipe and calls an $http.get to get a replacement, resets item list. Requires CORS plugin!
        vm.removeRecipeTryAgain = function(index){
          firstItemArray.splice(0, firstItemArray.length);
          finalRecipeArray.splice(index, 1);
          reallyFinalRecipeArray.splice(index, 1);
          y = Math.floor((Math.random() * bestRids.length));
          $http.get(
            'http://food2fork.com/api/get?key=6b91ff83a8b50ebe57a14f12073f1adb&rId=' + bestRids[y]
          ).success(function(obj) {
            finalRecipeArray.splice(index, 0, obj.recipe);
            reallyFinalRecipeArray.splice(index, 0, obj.recipe);
            finalRecipeArray.forEach(function(recipe){
              recipe.ingredients.forEach(function(item){
              var filteredItem = item.replace(cookingTerms, subst).toLowerCase();
              firstItemArray.push(filteredItem);
              })
            })
          })
        }

        //authorizes google calendar access. window.initGapi has to be called from mainview "#/" to work. IIFE called on controller load.
        vm.authorizeGcal = function(){
          gapi.auth.authorize({'client_id':'924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com', 'scope':'https://www.googleapis.com/auth/calendar',  'immediate': 'true'}, vm.getCalList);
          }();

        //sends user back to likes, doesn't destroy the selected arrays until they return to recipeCtrl
        vm.backToLikes = function(){
          $location.path('/pref1');
        };

        //main f2f ajax calls. HAVE TO HAVE CORS plugin to work. Makesure getRecipes.b and setDates.p stop iterating at the same number!!!

        //refactor/ make a pro condition to use the yummly API.
        vm.getRecipes = function(){
          vm.loading.push(1)
          var ridArray = [];
          var ridSearch = null;
          var b = 0;
          var iterator = 0;
          //searches cuisenes, returns recipe lists.
          for (var i = likesArray.length - 1; i >= 0; i--) {
            $http.get(
            'http://www.food2fork.com/api/search?key=6b91ff83a8b50ebe57a14f12073f1adb&q=' + likesArray[i].$id
            ).success(function(recipeList) {
              recipeList.recipes.forEach(function(recipe){
                ridArray.push(recipe);
                iterator++;
              }
              )
            }).then(function() {
              if (iterator >= (likesArray.length * 30)) {
                //^ make sure that if you do a new term, vm search call returns 30 items! otherwise, shit breaks!
                ridArray.forEach(function(recipe) {
                  if(recipe.social_rank >= 99){
                    bestRids.push(recipe.recipe_id);
                    console.log(bestRids)
                  }
                });
                //While loop. don't make vm shit infinite.
                while (b <= 6) {
                  y = Math.floor((Math.random() * bestRids.length));
                    ridSearch = bestRids[y];
                    console.log(bestRids[y])
                    //main recipe get ajax call.
                    $http.get(
                      'http://food2fork.com/api/get?key=6b91ff83a8b50ebe57a14f12073f1adb&rId=' + ridSearch
                        ).success(function(objectA) {
                          finalRecipeArray.push(objectA.recipe);
                          reallyFinalRecipeArray.push(objectA.recipe);
                          objectA.recipe.ingredients.forEach(function(item){
                            var filteredItem = item.replace(cookingTerms, subst).toLowerCase();
                            firstItemArray.push(filteredItem);
                          })
                          console.log(finalRecipeArray);
                          console.log(reallyFinalRecipeArray);
                          loading.pop();
                        }
                        )
                  //deletes recipe from bestRids, increments b so theres not an infinite loop
                  bestRids.splice(y, 1);
                  b++
                  }
                  }
                });
            };
          }; // end getRecipes

        // main function logic for assigning recipes to google cal.
        vm.megaFire = function(){
          vm.finalItemArray = firstItemArray;
            // event asset.
            var dinner = {
              "kind": "calendar#event",
              "summary": finalRecipeArray[0].title,
              "description": finalRecipeArray[0].ingredients.join(', '),
              "start": {
                "dateTime": startTime[0].toString(),
                "timeZone": 'America/Chicago'
              },
              "end": {
                "dateTime": endTime[0].toString(),
                "timeZone": 'America/Chicago'
              },

              "reminders": {
                "useDefault": false,
                "overrides": [
                  {
                    "method": 'popup',
                    "minutes": 90
                  }
                ]
              },
              "source": {
                "title": finalRecipeArray[0].title,
                "url": finalRecipeArray[0].source_url
              }
            };
            var requestEvents = gapi.client.calendar.events.list({
              'calendarId': calId,
              'timeMax': startTime[0].toString(),
              'timeMin': endTime[0].toString()
            });

            //checks if theres an event for vm time. Doesn't really work right now?
            requestEvents.execute(function(respE){
              console.log(respE);
              if (respE.etag = '""0""'){
                gapi.client.calendar.events.insert({
                    'calendarId': calId,
                    'resource': dinner
                  }).execute(function(respEC){
                  console.log(respEC)
                  console.log("Event created successfully");
                })
              } else {
                  console.log("Robots have already planned!");
              }
            })
            //calls the delayMegaFire callback.
            vm.delayMegaFire();
          }; // end megaFire

          //deletes date arrays as recipes are deleted out of finalRecipeArray and pushed to google calendar. callsback to megaFire.
      vm.delayMegaFire = function(){
            startTime.shift();
            endTime.shift();
            finalRecipeArray.shift();
            vm.megaFire();
          }; // end delayMegaFire
    }
  ]
)
