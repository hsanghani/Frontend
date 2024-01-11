
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBny3kaMoLsGQu--YdDQ_Wv1-KT-ugWySI",
    authDomain: "constant-b0150.firebaseapp.com",
    projectId: "constant-b0150",
    storageBucket: "constant-b0150.appspot.com",
    messagingSenderId: "890768948220",
    appId: "1:890768948220:web:80cd29ed98f724f0aed079",
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload?.notification?.title;
  const notificationOptions = {
    body: payload?.notification?.title,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});