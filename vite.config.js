import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://43.202.225.206:8080",
        changeOrigin: true,
        secure: false,
   
    cookieDomainRewrite: "localhost", // ★ 쿠키 도메인을 localhost로 재작성
    cookiePathRewrite: "/",           // ★ 쿠키 path도 /
          rewrite: (p) => {
      const keep = /^\/api\/(login|csrf)(\/|$)/; // 유지
      const strip = /^\/api\/(user|sections|steps|step-contents|roadmaps|notifications)(\/|$)/; // 제거
      if (keep.test(p)) return p;
      if (strip.test(p)) return p.replace(/^\/api/, '');
      return p;
    },
  },
}
  },
});


// vite.config.js

// 개발 서버 프록시 설정.
//+프록시는 중간에서 대신 요청 전달해주는 애
//+api는 가짜경로 지워주려고
// 프론트에서 /api/...로 호출하면 → 프록시가 http://43.202.225.206:8080/... 로 전달하고 /api 접두사는 제거.

// 예) 프론트 POST /api/user?... → 실제 서버 POST http://43.202.225.206:8080/user?...