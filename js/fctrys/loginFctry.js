app.factory('LoginFctry', ['$firebaseAuth', '$firebaseObject', '$location',
  function ($firebaseAuth, $firebaseObject, $location) {

  var currentUser = null;
  var client_id = '924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com';
  var scopes = 'https://www.googleapis.com/auth/calendar';

}

  return {

    onSignIn = function(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());

    handleAuthResult = function(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

    signOut = function() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
      console.log('User signed out.');
    });

    handleAuthClick = function(event) {
        gapi.auth.authorize(
          {client_id: '924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com', scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
    }




  }

  };
}])
