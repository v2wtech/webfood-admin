import axios from "axios";

const api = axios.create({
    baseURL: "http://webfood-api.herokuapp.com/api"
  });

export default api;
