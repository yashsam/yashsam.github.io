
importScripts("https://www.gstatic.com/firebasejs/5.0.3/firebase-app.js");

importScripts("https://www.gstatic.com/firebasejs/5.0.3/firebase-messaging.js");
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC_qZ_YOEY9seuq2u7LIw_84nZo8gXt-kY",
    authDomain: "gsm-demo-project.firebaseapp.com",
    databaseURL: "https://gsm-demo-project.firebaseio.com",
    projectId: "gsm-demo-project",
    storageBucket: "gsm-demo-project.appspot.com",
    messagingSenderId: "542868946576"
  };
  firebase.initializeApp(config);
  // Retrieve Firebase Messaging object.
  // [START get_messaging_object]
  // Retrieve Firebase Messaging object.
	const messaging = firebase.messaging();