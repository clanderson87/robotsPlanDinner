app.factory('authFactory',
  ['$firebaseAuth',
  '$firebaseObject',

  function (
      $firebaseAuth,
      $firebaseObject){

        var ref = new Firebase("https://rpd.firebaseio.com");
        return $firebaseAuth(ref);
      }
  ]
)
