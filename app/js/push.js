(function (window) {
  'use strict';

  //Push notification button
  var fabPushElement = document.querySelector('.fab__push');
  var fabPushImgElement = document.querySelector('.fab__image');
  var serverkey = 'AAAAfmWCvpA:APA91bHu9gbWqvMuQwcWWkxxAzp-SmyGCa_lgs0xGGn478XIv1qDAEQIbNiuRZ39GM5zE4w9tr-XZwBJJUleAj4mqrg9QU1NvjX1koq6esQNrsyBX4fgV8QyEHUBvTGa3iDlylmSQ0VR';
  var publickey = 'BLTsx4emyHsflgGZf_OZqjj0qRX1vKR0CYIE3UfMuTj7ALdDLZ0gZOswuLn7bKtHOjdywuwx8HfrDAvm2RqAyao';
  


  const messaging = firebase.messaging();
  const tokenDivId = 'token_div';
  const permissionDivId = 'permission_div';
var token = '';
messaging.usePublicVapidKey(publickey);
messaging.requestPermission().then(function() {
  console.log('Notification permission granted.');
  // TODO(developer): Retrieve an Instance ID token for use with FCM.
  // ...
}).catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});

// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken().then(function(currentToken) {
  console.log('CurerntTOken : '+currentToken);
  if (currentToken) {
    token = currentToken;
    sendTokenToServer(currentToken);
    updateUIForPushEnabled(currentToken);
  } else {
    // Show permission request.
    console.log('No Instance ID token available. Request permission to generate one.');
    // Show permission UI.
    updateUIForPushPermissionRequired();
    setTokenSentToServer(false);
  }
}).catch(function(err) {
  console.log('An error occurred while retrieving token. ', err);
  showToken('Error retrieving Instance ID token. ', err);
  setTokenSentToServer(false);
});

messaging.onMessage(function(payload) {
    console.log('Message received. ', payload);
    // [START_EXCLUDE]
    // Update the UI to include the received message.
    //appendMessage(payload);
    //console.log(self);
     //event.waitUntil(self.registration.showNotification(title, body));
    // [END_EXCLUDE]

    var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

navigator.serviceWorker.ready
      .then(function (registration) {
        registration.showNotification(notificationTitle,notificationOptions)
        
        .catch(function (error) {
          console.error('Error occurred while enabling push ', error);
        });
      });


  });
  
  //To check `push notification` is supported or not
  function isPushSupported() {
    //To check `push notification` permission is denied by user
    if (Notification.permission === 'denied') {
      console.warn('User has blocked push notification.');
      return;
    }

    //Check `push notification` is supported or not
    if (!('PushManager' in window)) {
      console.error('Push notification isn\'t supported in your browser.');
      return;
    }

    //Get `push notification` subscription
    //If `serviceWorker` is registered and ready
    navigator.serviceWorker.ready
      .then(function (registration) {
        registration.pushManager.getSubscription()
        .then(function (subscription) {
          //If already access granted, enable push button status
          if (subscription) {
            changePushStatus(true);
          }
          else {
            changePushStatus(false);
          }
        })
        .catch(function (error) {
          console.error('Error occurred while enabling push ', error);
        });
      });
  }

  //To subscribe `push notification`
  function subscribePush() {
    navigator.serviceWorker.ready.then(function(registration) {
      if (!registration.pushManager) {
        alert('Your browser doesn\'t support push notification.');
        return false;
      }

      //To subscribe `push notification` from push manager
      registration.pushManager.subscribe({
        userVisibleOnly: true //Always show notification when received
      })
      .then(function (subscription) {
        toast('Subscribed successfully.');
        console.info('Push notification subscribed.');
        changePushStatus(true);
        sendPushNotification();
      })
      .catch(function (error) {
        changePushStatus(false);
        console.error('Push notification subscription error: ', error);
      });
    })
  }

  //To unsubscribe `push notification`
  function unsubscribePush() {
    navigator.serviceWorker.ready
    .then(function(registration) {
      //Get `push subscription`
      registration.pushManager.getSubscription()
      .then(function (subscription) {
        //If no `push subscription`, then return
        if(!subscription) {
          console.error('Unable to unregister push notification.');
          return;
        }

        //Unsubscribe `push notification`
        subscription.unsubscribe()
          .then(function () {
            toast('Unsubscribed successfully.');
            console.info('Push notification unsubscribed.');
            changePushStatus(false);
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error('Failed to unsubscribe push notification.');
      });
    })
  }

  //To change status
  function changePushStatus(status) {
    fabPushElement.dataset.checked = status;
    fabPushElement.checked = status;
    if (status) {
      fabPushElement.classList.add('active');
      fabPushImgElement.src = '../images/push-on.png';
    }
    else {
     fabPushElement.classList.remove('active');
     fabPushImgElement.src = '../images/push-off.png';
    }
  }

  //Click event for subscribe push
  fabPushElement.addEventListener('click', function () {
    var isSubscribed = (fabPushElement.dataset.checked === 'true');
    if (isSubscribed) {
      unsubscribePush();
    }
    else {
      subscribePush();
    }
  });

  //Form data with info to send to server
  function sendPushNotification() {
    var notification = {
    'title': 'Portugal vs. Denmark',
    'body': '5 to 1',
    'icon': 'firebase-logo.png',
    'click_action': 'https://yashsam.github.io'
    };
   
    navigator.serviceWorker.ready
      .then(function(registration) {
        //Get `push subscription`
        registration.pushManager.getSubscription().then(function (subscription) {
          console.log('Token : '+token);
          
          //Send `push notification` - source for below url `server.js`
          fetch('https://fcm.googleapis.com/fcm/send', {
          'method': 'POST',
          'headers': {
            'Authorization': 'key='+serverkey,
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify({
            'notification': notification,
            'to': token
          })
        }).then(function(response) {
          console.log(response);
        }).catch(function(error) {
          console.error(error);
        })
          /*fetch('/send_notification', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
          })
          .then(function(response) {
            console.log(response);
            return response.json();
          })*/
        })
      })
  }
  //To send push notification
var pushBtn = document.getElementById("send-push");
console.log(pushBtn);
pushBtn.addEventListener("click", function () {
  sendPushNotification();
});

  isPushSupported(); //Check for push notification support


function resetUI() {
    clearMessages();
    showToken('loading...');
    // [START get_token]
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then(function(currentToken) {
      if (currentToken) {
      console.log('curreToken = '+currentToken);
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
      }
    }).catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      showToken('Error retrieving Instance ID token. ', err);
      setTokenSentToServer(false);
    });
    // [END get_token]
  }
  function showToken(currentToken) {
    // Show token in console and UI.
    var tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
  }
  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }
  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
  }
  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
  }
  function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      div.style = 'display: visible';
    } else {
      div.style = 'display: none';
    }
  }
  function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    messaging.requestPermission().then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      resetUI();
      // [END_EXCLUDE]
    }).catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    // [END request_permission]
  }
  function deleteToken() {
    // Delete Instance ID token.
    // [START delete_token]
    messaging.getToken().then(function(currentToken) {
      messaging.deleteToken(currentToken).then(function() {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        resetUI();
        // [END_EXCLUDE]
      }).catch(function(err) {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    }).catch(function(err) {
      console.log('Error retrieving Instance ID token. ', err);
      showToken('Error retrieving Instance ID token. ', err);
    });
  }
  // Add a message to the messages element.
  function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderELement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;';
    dataHeaderELement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderELement);
    messagesElement.appendChild(dataElement);
  }
  // Clear the messages element of all children.
  function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
      messagesElement.removeChild(messagesElement.lastChild);
    }
  }
  function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }
  function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
  }
  resetUI();
})(window);
