import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api" // ✅ 로컬: Vite 프록시 사용
      : "/api/proxy", // ✅ 배포: Vercel 서버리스 프록시 경로
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  timeout: 15000,
});

// 개발 중 요청 로그
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.log("[REQ]", config.method?.toUpperCase(), config.url);
    return config;
  });
}

// ✅ 배포 시 /api 접두사 정리 (Vercel 내부 프록시 경로 유지)
api.interceptors.request.use((config) => {
  if (import.meta.env.MODE !== "development") {
    let url = config.url || "";

    // 프록시 내부로 전달할 때 /api/proxy 부분만 유지
    if (url.startsWith("/api/proxy")) {
      config.url = url.replace(/^\/api\/proxy/, "");
    }
  }
  return config;
});

// 응답 로그
api.interceptors.response.use(
  (res) => res,
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
