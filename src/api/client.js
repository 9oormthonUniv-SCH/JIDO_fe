import axios from "axios";

// 환경에 따라 baseURL 다르게 설정
const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api" // ✅ 로컬(Vite dev server): proxy 사용
      : "http://54.180.92.141:8080", // ✅ 실제 백엔드 주소로 변경 (예시)
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN", // Spring 기본
  xsrfHeaderName: "X-XSRF-TOKEN", // Spring 기본
  timeout: 15000,
});

// (선택) 요청 로그
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.log("[REQ]", config.method?.toUpperCase(), config.url);
    return config;
  });
}

// 응답 로그
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
