app.factory('LoginFctry', ['$firebaseAuth', '$firebaseObject', '$location', 'platform',
  function ($firebaseAuth, $firebaseObject, $location, platform) {

  var currentUser = null;
  var client_id = '924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com';
  var scopes = 'https://www.googleapis.com/auth/calendar';

    var currentUser = null;

//init the firebase
  var ref = new Firebase("https://rpd.firebaseio.com");
  var usersRef = ref.child('users');


//c&p from firebase, wrapped in function
  this.login = function(){
      ref.authWithOAuthPopup("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          userRefObj = authData;
          userRefObj.username = authData.google.displayName;
          ref.child("users").child(authData.uid).set(userRefObj);
        };
      }
  )
};

  return {

        login: function(){
        ref.authWithOAuthPopup("google", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            userRefObj = authData;
            userRefObj.username = authData.google.displayName;
            ref.child("users").child(authData.uid).set(userRefObj);
          };
        })
        };

      /**
       * Check if current user has authorized this application.
       */
        checkAuth: function() {
          gapi.auth.authorize(
            {
              'client_id': '924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com',
              'scope': scopes.join(' '),
              'immediate': true
            }, handleAuthResult);
        }

        /**
         * Handle response from authorization server.
         *
         * @param {Object} authResult Authorization result.
         */
        handleAuthResult: function(authResult) {
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

        /**
         * Initiate auth flow in response to user clicking authorize button.
         *
         * @param {Event} event Button click event.
         */
        handleAuthClick: function(event) {
          gapi.auth.authorize(
            {client_id: '924207721083-ml5b665amj85lakklupikqurgrbaqatd.apps.googleusercontent.com', scope: SCOPES, immediate: false},
            handleAuthResult);
          return false;
        }

        /**
         * Load Google Calendar client library. List upcoming events
         * once client library is loaded.
         */
        loadCalendarApi: function() {
          gapi.client.load('calendar', 'v3', listUpcomingEvents);
        }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
        listUpcomingEvents: function() {
          var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
          });

        request.execute(function(resp) {
          var events = resp.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }

        });
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('output');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

    </script>
    <script src="https://apis.google.com/js/client.js?onload=checkAuth">
    </script>


  }

  }
};
}])
