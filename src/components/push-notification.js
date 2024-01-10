import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyC4iRPE1qLXBsPM30n9ejqdXsp5SJ6a0Zg",
  authDomain: "virtual-stratum-392605.firebaseapp.com",
  projectId: "virtual-stratum-392605",
  storageBucket: "virtual-stratum-392605.appspot.com",
  messagingSenderId: "942979998755",
  appId: "1:942979998755:web:839dbdda0ee4920a363d96",
};
const vapidKey =
  "BIaksp4GN8kCKRSvsMYK3U_8keJn5INIkB-Z1-P8XX5j0H3tJDO-N1DVGsnryaJpKg5Ah7WcwRSp9ijqU4flRDE";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const PushNotification = () => {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey: vapidKey })
          .then((currentToken) => {
            if (currentToken) {
              console.log("FCM Token:", currentToken);
            } else {
              console.log("No registration token available.");
            }
          })
          .catch((error) => {
            console.error("Error getting FCM token:", error);
          });
      } else {
        console.warn("Permission for notifications denied");
      }
    });

    // Handle messages when the app is in the foreground
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received:", payload);

      // Handle the received message here
      const { title, body, data } = payload.notification;
      console.log("Title, Body, CustomData", title, body, data);

      // You can use the data payload to customize the notification content
      const customData = data || {};
      // Handle the notification as needed

      return customData
    });

    // Clean up subscriptions when the component is unmounted
    return unsubscribe;
    
  }, []);

  return (
    <div>
      <h1>Push Notification Example</h1>
      {/* Your component content */}
    </div>
  );
};

export default PushNotification;