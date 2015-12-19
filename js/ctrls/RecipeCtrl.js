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
        var rpdCalendar = {
            summary: "Robot Planned Dinners"
          }


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
              finalRecipe = object.recipe;
              finalRecipeArray.push(finalRecipe);
              console.log(finalRecipe);
              console.log(finalRecipeArray);
              return {
                finalRecipe,
                finalRecipeArray
              }

             })
             })
          };

          this.thisOrThat = function(){
            gapi.client.setApiKey();
            console.log("api key set!")
            gapi.client.load('calendar', 'v3')
            console.log("api loaded!");
            console.log(gapi.client)
            console.log(gapi.client.Calendar);
            console.log("Fuck this shit")
          }

        this.slapToGoogle = function(){
          console.log(gapiService)
          console.log(gapi.client)
          gapi.auth.authorize({'client_id':'924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com', 'scope':'https://www.googleapis.com/auth/calendar'}, this.thisOrThat);
          (function(resp){
              console.log("This happened");
            });

          console.log(rpdCalendar)
          // Calendar.insertCalendars(rpdCalendar);
          // var event = {
          //   'summary': finalRecipe,
          //   'description': finalRecipe.ingredients.toString(),
          //   'start': {
          //     'dateTime': user.mealTime,
          //     'timeZone': 'America/Chicago'
          //   },
          //   'end': {
          //     'dateTime': '2015-05-28T17:00:00-07:00',
          //     'timeZone': 'America/Chicago'
          //   },
          // };

          // var request = gapi.client.calendar.events.insert({
          //   'calendarId': 'primary',
          //   'resource': event
          // });

          // request.execute(function(event) {
          //   appendPre('Event created: ' + event.htmlLink);
          // });
          }
        }
  ]
)
