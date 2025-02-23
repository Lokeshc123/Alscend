import axios from "axios";

const baseURL = "http://192.168.18.10:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
