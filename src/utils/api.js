import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_PROXY_URL}/api`,
  // baseURL: `http://localhost:5000/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 모든 요청이 서버로 전송되기 전에 실행됩니다.
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      // 토큰이 존재하면 Authorization 헤더에 Bearer 스키마로 추가합니다.
      config.headers["authorization"] = "Bearer " + token;
    }
    return config; // 수정된 설정을 반환합니다.
  },
  (error) => {
    return Promise.reject(error); // 오류가 발생하면 프로미스를 거부합니다.
  }
);

api.interceptors.request.use(
  (request) => {
    // console.log("Starting Request", request);
    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
  }
);

api.interceptors.response.use(
  (response) => {
    // console.log("Response:", response);
    return response;
  },
  function (error) {
    error = error.response.data;
    console.log("RESPONSE ERROR", error);
    return Promise.reject(error);
  }
);

export default api;
