import axios from "axios";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

const authAxios = axios.create({
  baseURL: serverBaseUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const normalAxios = axios.create({
  baseURL: serverBaseUrl,
});

export { authAxios,normalAxios };
