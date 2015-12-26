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


        this.authorizeGcal = function(){
          gapi.auth.authorize({'client_id':'924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com', 'scope':'https://www.googleapis.com/auth/calendar', 'immediate': 'true'}, this.createCalOrEvent);
          };

        this.getRecipes = function(){
          var b = 0;
          var iterator = 0;
          for (var i = likesArray.length - 1; i >= 0; i--) {
            $http.get(
            'http://www.food2fork.com/api/search?key=6b91ff83a8b50ebe57a14f12073f1adb&q=' + likesArray[i].$id
            ).success(function(recipeList) {
              recipeList.recipes.forEach(function(recipe){
                if(recipe.social_rank > 98.5){
                ridArray.push(recipe.recipe_id);
                iterator++;

              }
              }
              )
            }).then(function() {
              if (iterator > 29) {
                    while (b <= 6) {
                        y = Math.floor((Math.random() * ridArray.length));
                        ridSearch = ridArray[y];
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


// EVERYTHING ABOVE WORKS FOR THE LOVE OF GOD DON'T FUCK IT UP.

        this.createCalOrEvent = function(){
          var summaryArray = [];
          var startTime = [];
          var endTime = [];
          var rndmDate = function(){
            var d = new Date();
            var x = (Math.floor(Math.random() * 7) + 1);
            var rDate = ((d.getDate()) + x)
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
          rndmDate();

          var dinner = {
                    "kind": "calendar#event",
                    "htmlLink": this.finalRecipe.source_url,
                    "summary": this.finalRecipe.title,
                    "description": this.finalRecipe.ingredients.join(', '),
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
                      "title": this.finalRecipe.title,
                      "url": this.finalRecipe.source_url
                    }
                  }
            gapi.client.calendar.calendarList.list().execute(function(resp){
              console.log(resp);
              resp.items.forEach(function(object){
                summaryArray.push(object.id, object.summary);
            });
            console.log(summaryArray);
            if (summaryArray.indexOf('RobotPlannedDinners') >= 0) {
              var v = (summaryArray.indexOf('RobotPlannedDinners') - 1);
              var calId = summaryArray[v].toString();
              var requestEvents = gapi.client.calendar.events.list({
                'calendarId': calId,
                'timeMax': startTime.toString(),
                'timeMin': endTime.toString()
              })
              requestEvents.execute(function(resp){
                console.log(resp);
              })

              var requestCreation = gapi.client.calendar.events.insert({
                  'calendarId': calId,
                  'resource': dinner
                })
              requestCreation.execute(function(resp){
                console.log(resp)
              })
              console.log("Event created successfully");
            } else {
              var request = gapi.client.calendar.calendars.insert({'summary':'RobotPlannedDinners'}).execute(function(resp){
                  console.log(resp);
                });
            }
          });
          }
        }
  ]
)
