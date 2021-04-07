importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');
firebase.initializeApp({
  messagingSenderId: "1062407524656",
  name: "patients_app"
});
const messaging = firebase.messaging(firebaseInitializeApp);

messaging.setBackgroundMessageHandler(function(payload) {
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
