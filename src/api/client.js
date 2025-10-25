import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api" // ✅ 로컬: Vite 프록시 사용
      : "http://54.180.92.141:8080", // ✅ 배포: 실제 서버 주소
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

// ✅ 배포 환경일 때 /api 제거 또는 유지 로직
api.interceptors.request.use((config) => {
  if (import.meta.env.MODE !== "development") {
    let url = config.url || "";

    // 🔹 그대로 유지해야 하는 API 목록 (login, csrf, search 등)
    const keep = /^\/api\/(login|csrf|search)(?=\/|$|\?)/;

    // 🔹 /api 접두사를 제거해야 하는 API 목록 (user, roadmaps 등)
    const strip = /^\/api\/(user|sections|steps|step-contents|roadmaps|notifications|categories|comments)(\/|$)/;

    if (keep.test(url)) {
      // ✅ 유지할 목록은 그대로 둠
      config.url = url;
    } else if (strip.test(url)) {
      // ✅ 제거해야 할 목록은 /api 제거
      config.url = url.replace(/^\/api(?=\/|\?|$)/, "");
    } else if (url.startsWith("/api/")) {
      // ✅ 기타 나머지 /api/... 도 제거 (백엔드 경로 일치용)
      config.url = url.replace(/^\/api(?=\/|\?|$)/, "");
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
