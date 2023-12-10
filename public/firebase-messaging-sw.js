importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


 //the Firebase config object 
const firebaseConfig = {
  apiKey: "AIzaSyA6nX9LDE3PsBzO_jxr-Jd6eE05XznEOJQ",
  authDomain: "authproject-3fc51.firebaseapp.com",
  projectId: "authproject-3fc51",
  storageBucket: "authproject-3fc51.appspot.com",
  messagingSenderId: "842659658057",
  appId: "1:842659658057:web:e9026b4f61d803fa174298",
  measurementId: "G-DVS3GQVK10"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();



messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});