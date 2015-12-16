app.controller('RecipeCtrl',
  [
  '$firebaseArray',
  '$firebaseObject',
  '$http',
  'LoginFctry',

    function(
      $firebaseArray,
      $firebaseObject,
      $http,
      loginFctry) {

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


        this.getRecipe = function(){
            $http.get(
            'http://www.food2fork.com/api/search?key=6b91ff83a8b50ebe57a14f12073f1adb&q=' + searchTerm
            ).success( function(object) {
              object.recipes.forEach(function(recipe){
                ridArray.push(recipe.recipe_id);
              })
              console.log(ridArray);
              y = Math.floor((Math.random() * ridArray.length) +.5)
              ridSearch = ridArray[y];
              console.log(ridSearch);
              $http.get(
              'http://food2fork.com/api/get?key=6b91ff83a8b50ebe57a14f12073f1adb&rId=' + ridSearch
              ).success(function(object) {
              console.log(object.recipe);
              finalRecipe = object.recipe;

             })
             })
          };

        this.slapToGoogle = function(){

          };
        }
  ]
)
