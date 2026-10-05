import axios from "axios";
import { startRequest, endRequest } from "./apiLoading";
const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const baseURL = API_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  //timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: `Token ${API_TOKEN}`,
  },
});

// keep a count of in-flight requests to drive the map loading indicator
axiosInstance.interceptors.request.use((config) => {
  startRequest();
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    endRequest();
    return response;
  },
  (error) => {
    endRequest();
    return Promise.reject(error);
  }
);

export default axiosInstance;
