app.factory('refFctry',
  ['$firebaseArray',
  '$firebaseObject',

  function (
      $firebaseArray,
      $firebaseObject){

        var ref = new Firebase("https://rpd.firebaseio.com");
        var refArray = $firebaseArray(ref);
        var refObj = $firebaseObject(ref);

        return {
          ref,
          refArray,
          refObj,
        };
      }
  ]
)
