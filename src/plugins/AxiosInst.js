import Axios from "axios";

const AxiosInst = Axios.create({
  //baseURL: "http://localhost:8077",
  timeout: process.env.VUE_APP_BASE_API_TIMEOUT,
  withCredentials: true,
});

AxiosInst.interceptors.request.use((config) => {
  config.headers.authorization = "token";
  config.headers["Access-Control-Allow-Origin"] = "*"; // CORS 설정(모든 리소스 허용)
  return config;
});

export default AxiosInst;
