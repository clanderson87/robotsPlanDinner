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

        console.log(likesArray);
        console.log(allergyArray);

        // this.getRecipes = function()



        // this.commencePrimaryIgnition = function(Allergies, Likes){
        // $http.get('http://food2fork.com/api/search?key=6b91ff83a8b50ebe57a14f12073f1adb&q='+ , function(data) {
        //   /*optional stuff to do after success */
        // });

        }
  ]
)
