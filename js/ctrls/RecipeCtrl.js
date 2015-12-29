app.controller('RecipeCtrl',
  [
  '$firebaseArray',
  '$scope',
  '$firebaseObject',
  '$http',
  '$window',
  'LoginFctry',
  'gapiService',

    function(
      $firebaseArray,
      $scope,
      $firebaseObject,
      $http,
      $window,
      loginFctry,
      gapiService) {

        //Firebase code
        var ref = new Firebase("https://rpd.firebaseio.com");
        var auth = ref.getAuth();
        var user = auth.uid;
        var daysToPlan = ref.child("daysToPlan").orderByValue().equalTo(user);
        var allergyRef = ref.child("allergies").orderByValue().equalTo(user);
        var allergyArray = $firebaseArray(allergyRef);
        var likesRef = ref.child("likes").orderByValue().equalTo(user);
        var likesArray = $firebaseArray(likesRef);

        //Opening Empty Variables
        var searchLikesArray = [];
        var searchTerm = "";
        var ridArray = [];
        var ridSearch = null;
        var finalRecipe = {};
        var finalRecipeArray = [];
        var calId = "";


        this.getCalList = function(){
        //setting empty variables for calendar ops
          var summaryArray = [];
          var getCalId = function(){
            if (summaryArray.indexOf('RobotPlannedDinners') >= 0) {
                var v = (summaryArray.indexOf('RobotPlannedDinners') - 1);
                calId = summaryArray[v].toString();
                console.log(calId);
            } else {
              var requestCals = gapi.client.calendar.calendars.insert({'summary':'RobotPlannedDinners'}).execute(function(respC){
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
        }


        this.authorizeGcal = function(){
          gapi.auth.authorize({'client_id':'924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com', 'scope':'https://www.googleapis.com/auth/calendar', 'immediate': 'true'}, this.getCalList);
          };

        this.authorizeGcal();

        this.getRecipes = function(){
          var b = 0;
          var iterator = 0;
          var bestRids = [];
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
                ridArray.forEach(function(recipe) {
                  if(recipe.social_rank >= 99){
                    bestRids.push(recipe.recipe_id)
                  }
                });
                while (b <= 6) {
                  y = Math.floor((Math.random() * bestRids.length));
                    ridSearch = bestRids[y];
                    $http.get(
                      'http://food2fork.com/api/get?key=6b91ff83a8b50ebe57a14f12073f1adb&rId=' + ridSearch
                        ).success(function(objectA) {
                          this.finalRecipe = objectA.recipe;
                          finalRecipeArray.push(this.finalRecipe);
                          console.log(finalRecipeArray);

                        }
                        )
                  b++
                  }
                  }
                  })
            }
          }


// EVERYTHING ABOVE WORKS KIND OF. FOR THE LOVE OF GOD DON'T FUCK IT UP.

        //more empty variables for setDates function
        this.megaFire = function(){
            var d = new Date();
            var startTime = [];
            var endTime = [];
            var setDates = function(z){
              var rDate = ((d.getDate()) + z)
              d.setDate(rDate);
              d.setHours(18);
              d.setMinutes(00);
              d.setSeconds(00);
              console.log(d)
              startTime.push(d.toISOString());
              d.setHours(19);
              console.log(d)
              endTime.push(d.toISOString());
            };
            var dinner = {
              "kind": "calendar#event",
              "htmlLink": finalRecipeArray[0].source_url,
              "summary": finalRecipeArray[0].title,
              "description": finalRecipeArray[0].ingredients.join(', '),
              "start": {
                "dateTime": startTime.toString(),
                "timeZone": 'America/Chicago'
              },
              "end": {
                "dateTime": endTime.toString(),
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
            gapi.client.calendar.events.list({
              'calendarId': calId,
              'timeMax': startTime.toString(),
              'timeMin': endTime.toString()
            }).execute(function(respE){
              console.log(respE);
              if (respE.etag = '""0""'){
                setDates();
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
            finalRecipeArray.unshift();
            if(finalRecipeArray.length > 0){
              this.megaFire();
            }
          //end of doWhile statement;
        } //end of megaFire

    }
  ]
)
