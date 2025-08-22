// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 프록시 사용 중이면 /api
   withCredentials: true,
   xsrfCookieName: "XSRF-TOKEN",    // ★ 스프링 기본
  xsrfHeaderName: "X-XSRF-TOKEN",  // ★ 스프링 기본
  timeout: 15000,
});

// (선택) 요청/응답 로그만 남기고, 헤더 주입은 안 한다
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.log("[REQ]", config.method?.toUpperCase(), config.url);
    return config;
  });
}

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const { config, response } = err || {};
    console.log("[RES ERR]", config?.method?.toUpperCase(), config?.url, {
      status: response?.status,
      data: response?.data,
    });
    return Promise.reject(err);
  }
);

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