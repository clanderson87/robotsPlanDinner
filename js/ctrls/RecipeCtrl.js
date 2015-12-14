app.controller('RecipeCtrl',
  [
  '$firebaseArray',
  '$firebaseObject',
  'LoginFctry',

    function(
      $firebaseArray,
      $firebaseObject,
      loginFctry) {

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
          return searchTerm;
        };

        this.getRecipes = function(){

        };

        }
  ]
)
