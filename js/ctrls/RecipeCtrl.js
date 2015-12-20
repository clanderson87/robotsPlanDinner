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


        //Google Shit. Maybe.
        // var CLIENT_ID = '924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com';

        var apiKey = 'AIzaSyB3X-I9Eha9q4Ddry7dqRMX7b9WI13XyWc';
        // gapi.client.setApiKey(apiKey)

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
        var calId = ""



        //testing code for getting the searchTerm, modify to get dishes for v2.

        this.getTerm = function(){
          likesArray.forEach(function (like)
            {
              searchLikesArray.push(String(like.$id));
            });
          console.log(searchLikesArray)
          x = Math.floor((Math.random() * searchLikesArray.length) +.5);
          console.log(x);
          searchTerm = searchLikesArray[x];
          console.log(searchTerm);
        };


        this.getRecipe = function(){
            console.log(finalRecipe);
            console.log(finalRecipeArray);
            $http.get(
            'http://www.food2fork.com/api/search?key=6b91ff83a8b50ebe57a14f12073f1adb&q=' + searchTerm
            ).success( function(object) {
              object.recipes.forEach(function(recipe){
                if(ridArray.length < 11){
                ridArray.push(recipe.recipe_id);
              }
              })
              console.log(ridArray);
              y = Math.floor((Math.random() * ridArray.length) +.5)
              ridSearch = ridArray[y];
              console.log(ridSearch);
              $http.get(
              'http://food2fork.com/api/get?key=6b91ff83a8b50ebe57a14f12073f1adb&rId=' + ridSearch
              ).success(function(object) {
              this.finalRecipe = object.recipe;
              finalRecipeArray.push(finalRecipe);
             })
          }
        );
      }


        this.createCalOrEvent = function(){
          var summaryArray = [];
          var dinner = {
                    "kind": "calendar#event",
                    "htmlLink": this.finalRecipe.source_url,
                    "summary": this.finalRecipe.title,
                    "description": this.finalRecipe.ingredients.join(', ').toString(),
                    "start": {
                      "dateTime": '2015-12-20T00:30:00.000Z',
                      "timeZone": 'America/Chicago'
                    },
                    "end": {
                      "dateTime": '2015-12-20T01:30:00.000Z',
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
                    "attachments": [
                      {
                        "fileUrl": this.finalRecipe.source_url
                      }
                    ]
                  }
            gapi.client.calendar.calendarList.list().execute(function(resp){
              console.log(resp);
              resp.items.forEach(function(object){
                summaryArray.push(object.id, object.summary);
            });
            console.log(summaryArray);
            if (summaryArray.indexOf('RobotPlannedDinners') >= 0) {
              var v = (summaryArray.indexOf('RobotPlannedDinners') - 1);
              var calId = summaryArray[v];
              console.log(calId);
              console.log(gapi.client.calendar.events.insert);
              var request = gapi.client.calendar.events.insert({
                  'calendarId': calId,
                  'resource': dinner
                })
              request.execute(function(resp){
                console.log(resp)
              })
              console.log("Got here");
            } else {
              var request = gapi.client.calendar.calendars.insert({'summary':'RobotPlannedDinners'}).execute(function(resp){
                  console.log(resp);
                });
            }
          });
          };

        this.authorizeGcal = function(){
          gapi.auth.authorize({'client_id':'924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com', 'scope':'https://www.googleapis.com/auth/calendar', 'immediate': 'true'}, this.createCalOrEvent);;
          }
        }
  ]
)
