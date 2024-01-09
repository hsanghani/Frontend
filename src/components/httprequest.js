import axios from "axios";

axios.interceptors.response.use(
  (response) => {
    if (response.status === 400) {
      return response;
    }
  },
  (error) => {
    console.error("Global error handling:", error.message);
    return Promise.reject(error);
  }
);
