export default async function handler(req, res) {
  const targetBase = "http://54.180.92.141:8080"; // 백엔드 HTTP 서버 주소

   // "/api/proxy" 접두사 제거
  const targetPath = req.url.replace(/^\/api\/proxy/, "");
  const targetUrl = `${targetBase}${targetPath}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: "54.180.92.141:8080", // 백엔드 호스트 유지
      },
      body: req.method !== "GET" ? req.body : undefined,
    });

    // 백엔드 응답을 그대로 전달
    const contentType = response.headers.get("content-type");
    res.setHeader("content-type", contentType || "application/json");

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Proxy request failed" });
  }
}
