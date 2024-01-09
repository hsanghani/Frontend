import React, { useEffect, useState } from "react";
import axios from "axios";
import "./form.css";
// import { pedirPermissaoParaReceberNotificacoes } from "./push-notification";
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { Toast } from "bootstrap";

// import firebase from 'firebase/app';
// import 'firebase/messaging';

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
// const auth = getAuth(app);
const messaging = getMessaging(app);

// onMessage((payload) => {
//   console.log(payload, "payload");
// });

onMessage(messaging, (payload) => {
  console.log('Message received:', payload);

  // Handle the received message here
  const { title, body, data } = payload.notification;

  // You can use the data payload to customize the notification content
  const customData = data || {};

  console.log("title, body, customData ",title, body, customData)
  // Use the title, body, and customData to display in your notification UI
  // displayNotification(title, body, customData);
});

// const displayNotification = (title, body, customData) => {
//   // Your logic to display the notification using a library like 'react-toastify' or the browser's Notification API
//   // Example: react-toastify
//   // Toast(`${title}: ${body} - Custom Data: ${JSON.stringify(customData)}`);
// };

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

const Form = () => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  const [latitudeval, setLatitudeval] = useState("");
  const [longitudeval, setLongitudeval] = useState("");
  const [status, setStatus] = useState("");
  const [post, setPost] = useState([]);

  const apiCall = (baseurl, obj,token) => {
    axios
      .post(baseurl + "users", {...obj,token})
      .then((response) => {
        setPost(response.data);
        setData({
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
        });
        console.log("id",response.data._id);
        console.log("for token",response.data);
        localStorage.setItem("id", response.data._id);
        localStorage.setItem("isLoggin", true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setStatus("Bad Request");
            alert(error.response.data.message);
          } else if (error.response.status === 401) {
            setStatus("Unauthorized");
          } else {
            setStatus("Error: " + error.response.status);
          }
        } else if (error.request) {
          setStatus("No response received");
        } else {
          setStatus("Error: " + error.message);
        }
      });
  };

  //   function base64ToArray(encodedString) {
  //     try {
  //        const decodedString = atob(encodedString);
  //        return [...decodedString];
  //     } catch (error) {
  //        console.error('Error decoding base64:', error);
  //        return [];
  //     }
  //  }

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLatitudeval(latitude);
    setLongitudeval(longitude);

    setStatus("");

    if (
      data.firstname.trim() === "" ||
      data.lastname.trim() === "" ||
      data.email.trim() === "" ||
      data.password === "" ||
      data.username.trim() === ""
    ) {
      alert("all fields must be filled");
      return;
    }

    const obj = {
      firstName: data.firstname,
      lastName: data.lastname,
      username: data.username,
      email: data.email,
      password: data.password,
      lat: latitude,
      long: longitude,
    };

    const baseurl = process.env.REACT_APP_api_url;

    // async function getTokenInternal() {
    //   try {
    //     console.log("Getting FCM Token...");
    //     const token = await getToken(messaging, { vapidKey: vapidKey });
    //     console.log("FCM Token:", token);
    //     apiCall(baseurl, obj, token);
    //   } catch (error) {
    //     console.error("Error getting FCM token:", error);
    //   }
    // }

    function requestPermission() {
      console.log("Requesting permission...");
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Permission granted",messaging);
          // const data = pedirPermissaoParaReceberNotificacoes()
          // console.log("Permission granted",data);
          // getTokenInternal();

          // auth.onAuthStateChanged((user) => {
          //   if (user) {
          //     console.log(user, "usrersdhh");
              // Call getToken or perform other actions here
              getToken(messaging, { vapidKey: vapidKey })
                .then((token) => {
                  console.log("Permission granted", token);
                  apiCall(baseurl, obj, token);
                })
                .catch((error) => {
                  console.log("Permission denied", error);
                });
          //   }
          // });

          // getToken(messaging, { vapidKey: vapidKey })
          //   .then((token) => {
          //     console.log("FCM Token:", token);
          //     apiCall(baseurl, obj, token);
          //   })
          //   .catch((error) => {
          //     console.error("Error getting FCM token:", error);
          //   });
        } else {
          console.warn("Permission for notifications denied");
        }
      });
    }

    if ('Notification' in window && 'serviceWorker' in navigator) {
    //   // navigator.serviceWorker.ready.then((data)=>console.log("Message received. ", data)).catch((err)=>console.log("Message received. ", err))
    //   // console.log("navigator:", );
    //   navigator.serviceWorker
    //     .register("./testi.js")
    //     .then((registration) => {
    //       console.log("Service worker registered:", registration);
    requestPermission();
    // })
    // .catch((error) => {
    //   console.error("Service worker registration failed:", error);
    // });
    } else {
      console.warn('This browser does not support Firebase Cloud Messaging.');
      // Implement a fallback mechanism or inform the user about the lack of support
    }
  };

  const error = () => {
    setStatus("Unable to retrieve your location");
    alert("Unable to retrieve your location");
  };

  const handleFindMeClick = async () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating…");
      return await navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const formsubmit = async (e) => {
    e.preventDefault();
    await handleFindMeClick();
  };

  // useEffect(() => {
  //   localStorage.clear();
  // }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: " #f2f2f2",
        }}
      >
        <form onSubmit={formsubmit}>
          <div className="center">
            <div className="input-container ic1">
              <label htmlFor="fname">First Name:</label>
              <br />
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                value={data.firstname}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, firstname: e.target.value }))
                }
              />
            </div>
            <br />
            <div className="input-container ic1">
              <label htmlFor="lname">Last Name:</label>
              <br />
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                value={data.lastname}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, lastname: e.target.value }))
                }
              />
            </div>
          </div>
          <br />
          <div className="input-container ic1">
            <label htmlFor="uname">User Name:</label>
            <br />
            <input
              type="text"
              name="uname"
              placeholder="User Name"
              value={data.username}
              onChange={(e) =>
                setData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
          </div>
          <br />
          <div className="input-container ic1">
            <label htmlFor="Email">Email:</label>
            <br />
            <input
              type="email"
              name="Email"
              placeholder="Email"
              value={data.email}
              onChange={(e) =>
                setData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <br />
          <div className="input-container ic1">
            <label htmlFor="Password">Password:</label>
            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) =>
                setData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>
          <br />
          <div className="subbtn">
            <button>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Form;
