import axios from "axios";

const ruverseClient = axios.create({
  baseURL: `https://localhost:`,
  // timeout: 3000,
});

/*
ruverseClient.interceptors.request.use(
  function (config) {
    console.log("[AGORA CLIENT INTERCEPTOR]");
    config.headers.Authorization = authorizationField;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
*/

export { ruverseClient };
