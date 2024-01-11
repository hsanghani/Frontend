import "./form.css";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyBny3kaMoLsGQu--YdDQ_Wv1-KT-ugWySI",
//   authDomain: "constant-b0150.firebaseapp.com",
//   projectId: "constant-b0150",
//   storageBucket: "constant-b0150.appspot.com",
//   messagingSenderId: "890768948220",
//   appId: "1:890768948220:web:80cd29ed98f724f0aed079",
//   // measurementId: "G-SMTTRJY55M"
// };
var firebaseConfig = {
  apiKey: "AIzaSyC4iRPE1qLXBsPM30n9ejqdXsp5SJ6a0Zg",
  authDomain: "virtual-stratum-392605.firebaseapp.com",
  projectId: "virtual-stratum-392605",
  storageBucket: "virtual-stratum-392605.appspot.com",
  messagingSenderId: "942979998755",
  appId: "1:942979998755:web:839dbdda0ee4920a363d96",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
console.log(messaging)

// export async function getFCMToken() {
//   try {
//     const token = await getToken(messaging, { vapidKey: "BJgqftuU0f7BCgQfJxq4HyuUrYefx8AJzSefezfhOhB7OoUQAvDymCiHdI8kkPmEwiDCgCcj8UBLdml3sMr8l40" });
//     console.log("FCM Token:", token);

//     if (token) {
//       return token;
//     }else{
//       console.log('No registration token available. Request permission to generate one.');
//     }
//     // Now you can use the token or perform other actions
//     // ...

//   } catch (error) {
//     console.error("Error getting FCM token:", error);
//   }
// }

// console.log(getFCMToken,"--------------------------------");
// Call the async function
// getFCMToken();

export const FCMToken = () => {
  return  getToken(messaging, {
    vapidKey: "BIaksp4GN8kCKRSvsMYK3U_8keJn5INIkB-Z1-P8XX5j0H3tJDO-N1DVGsnryaJpKg5Ah7WcwRSp9ijqU4flRDE"
    // 'BJgqftuU0f7BCgQfJxq4HyuUrYefx8AJzSefezfhOhB7OoUQAvDymCiHdI8kkPmEwiDCgCcj8UBLdml3sMr8l40' 
  }).then((currentToken) => {
    if (currentToken) {
      console.log(currentToken, ' token')
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  });
}

FCMToken();

export const onMessageListener = () =>
  new Promise((resolve) => {
    FCMToken();
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      // resolve(payload);
    });
  });
