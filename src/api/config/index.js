// const axios = require("axios").default;

// export const api = axios.create({
//   baseURL: "https://gangr.uforiaprojects.com/api/local/",
// });
import axios from "axios";

export const api = axios.create({
  baseURL: "https://gangr.uforiaprojects.com/api/local/",
});

export const postURL = "?shop=kamrandevstore.myshopify.com";
export const preURL = "https://gangr.uforiaprojects.com/api/local";
