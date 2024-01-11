import React , { useEffect, useState } from "react";
import axios from "axios";

const GeoLocationFinder = () => {
  const [status, setStatus] = useState("");
  const [postdata, setPostdata] = useState("");
  // const getId = localStorage.getItem("id");
  const isLoggin = localStorage.getItem("isLoggin");
  console.log(isLoggin);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setStatus("success");

    const latLong = {
      lat: latitude,
      long: longitude,
    };

    const baseurl = process.env.REACT_APP_api_url;

    const getId = localStorage.getItem("id");
    console.log(getId);

    axios
      .put(baseurl + "users/nearByUsers/" + getId, latLong)
      .then((response) => {
        console.log(response.data.responses,"response");
        setPostdata(response.data);
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

  const error = () => {
    setStatus("Unable to retrieve your location");
  };

  const handleFindMeClick = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  
  useEffect(() => {
    if (localStorage.getItem("id")) {
      handleFindMeClick();
    }
    const intervalId = setInterval(() => {
      if (localStorage.getItem("id")) {
        handleFindMeClick();
      } else {
        console.log("???????????????");
      }
    }, 1000 * 60);
    return () => clearInterval(intervalId);
  }, [localStorage.getItem("id")]);

  return<></>
};

export default GeoLocationFinder;
