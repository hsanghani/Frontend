import { useEffect, useState } from "react";
import axios from "axios";

const GeoLocationFinder = () => {
  const [status, setStatus] = useState("");
  const [postdata, setPostdata] = useState("");
  // const getId = localStorage.getItem("id");
  const isLoggin = localStorage.getItem("isLoggin");
  console.log(isLoggin);

  console.log(status);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setStatus("");

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
        console.log(response,"success");
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
  // useEffect(() => {

  //   setTimeout(() => {
  //     if (isLoggin) {
  //       handleFindMeClick();
  //       console.log(">>>>>>>>>>>");
  //     } else {
  //       console.log("???????????????");
  //     }
  //   }, 11000);

  // },[])

  const intervalId = setInterval(() => {
  if (isLoggin) {
    handleFindMeClick();
    console.log(">>>>>>>>>>>");
  } else {
    console.log("???????????????");
  }
}, 180000); // 3 minutes in milliseconds

// Cleanup function to clear the interval when the component unmounts
useEffect(() => {
  return () => {
    clearInterval(intervalId);
  };
}, [intervalId]);

  // useEffect(() => {
  //   // const intervalId = setInterval(() => {
  //     setTimeout(() => {
  //     if (isLoggin) {
  //       handleFindMeClick();
  //       console.log(">>>>>>>>>>>");
  //     } else {
  //       console.log("???????????????");
  //     }
  //   }, 10000); // 3 minutes in milliseconds

  //   // Cleanup function to clear the interval when the component unmounts
  //   // return () => clearInterval(intervalId);
  // }, [isLoggin]);

  return<></>
};

export default GeoLocationFinder;
