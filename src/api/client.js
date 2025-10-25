import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api" // ✅ 로컬에서는 프록시 경유
      : "http://54.180.92.141:8080", // ✅ 배포 시 실제 서버
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  timeout: 15000,
});

// 개발 중에는 로그 확인
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.log("[REQ]", config.method?.toUpperCase(), config.url);
    return config;
  });
}

// ✅ 핵심 로직: 배포환경에서 prefix 자동 정리
api.interceptors.request.use((config) => {
  if (import.meta.env.MODE !== "development") {
    const url = config.url;

    // 1) 특정 API들은 /api 붙여야 함
    const needApiPrefix = /^(\/login|\/csrf|\/search)(\/|$)/.test(url);

    // 2) 나머지는 /api 제거 (백엔드에서 이미 경로 시작)
    if (url.startsWith("/api/") && !needApiPrefix) {
      config.url = url.replace(/^\/api/, "");
    }

    // 3) /api 없는 애 중 붙여야 하는 경우 자동 추가
    if (!url.startsWith("/api/") && needApiPrefix) {
      config.url = `/api${url}`;
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
