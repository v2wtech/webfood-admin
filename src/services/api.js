// import React, { Component  } from "react";
import axios from "axios";

const api = axios.create({
    baseUrl: "http://webfood-api.herokuapp.com"
  });


export default api;