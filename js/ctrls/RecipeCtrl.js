app.controller('RecipeCtrl',
  [
  '$firebaseArray',
  '$firebaseObject',
  'LoginFctry',
  '$http',

    function(
      $firebaseArray,
      $firebaseObject,
      loginFctry,
      $http) {

        var ref = new Firebase("https://rpd.firebaseio.com");
        var auth = ref.getAuth();
        var user = auth.uid;
        var allergyRef = ref.child("allergies").orderByValue().equalTo(user);
        var allergyArray = $firebaseArray(allergyRef);
        var likesRef = ref.child("likes").orderByValue().equalTo(user);
        var likesArray = $firebaseArray(likesRef);
        var searchLikesArray = [];
        var ridArray = [];
        var searchTerm = "";

        // console.log(likesArray);
        // console.log(allergyArray);

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


        this.getRecipes = function(){
        $http({
          method: 'GET'
          url: 'http://food2fork.com/api/search?key=6b91ff83a8b50ebe57a14f12073f1adb&q=' + searchTerm
          }).then(function successCallback(response) {
              console.log(response);
          }, function errorCallback(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
          });
        }

        }
  ]
)
