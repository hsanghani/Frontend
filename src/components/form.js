import React, { useEffect, useState } from "react";
import axios from "axios";
import "./form.css";
import { FCMToken, onMessageListener } from "./messageNotification";

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

  const apiCall = async (baseurl, obj, token) => {
    axios
      .post(baseurl + "users", { ...obj, token })
      .then((response) => {
        setPost(response.data);
        setData({
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
        });
        console.log("id", response.data._id);
        console.log("for token", response.data);
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

    function requestPermission() {
      console.log("Requesting permission...");
      Notification.requestPermission().then(async (permission) => {
        console.log("Permission...", permission);
        if (permission === "granted") {
          const token = await FCMToken();
          console.log("tok tok tok tok tok tok tok tok tok tok tok", token);
          if(token){
            apiCall(baseurl, obj, token);
          }else{
            console.log("token is not there")
          }
        } else {
          console.warn("Permission for notifications denied");
        }
      }).catch((err) => { console.log(err) });
    }

    if ("Notification" in window && "serviceWorker" in navigator) {
      requestPermission();
    } else {
      console.warn("This browser does not support Firebase Cloud Messaging.");
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
  useEffect(() => {
    // await FCMToken();
    onMessageListener()
      .then((payload) => {
        console.log("payload", payload);
        // setNotification({
        //   title: payload?.notification?.title+"hello world",
        //   body: payload?.notification?.body,
        // });
      })
      .catch((err) => console.log("failed: ", err));
  }, []);
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
