// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 프록시 사용 중이면 /api
});

//confing는 서버에 보낼 요청 패키지
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // 로그인 시 저장
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 디버그 로그
  console.log("[REQ]", config.method?.toUpperCase(), config.url, {
    hasAuth: !!token,
    authHeader: config.headers.Authorization,
  });
  return config;
});

export default api;


// src/api/client.js

// 공용 Axios 클라이언트.

// baseURL: "/api" → 모든 API 호출이 /api/...로 시작.

// 요청 인터셉터:

// localStorage.accessToken이 있으면 Authorization: Bearer <token> 자동 첨부.

// 디버그 로그 찍음: [REQ] POST /user ...

// 요약

// 네가 API 모듈에서 api.post("/user?...") 하면

// 실제 요청 URL: /api/user?...

// 프록시가 서버로 전달: http://43.202.225.206:8080/user?...