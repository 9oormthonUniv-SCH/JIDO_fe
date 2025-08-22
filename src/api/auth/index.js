import api from "../client";

// (옵션) CSRF가 켜져 있으면 로그인 전에 한번 호출
// export async function initCsrf() { try { await api.get("/csrf"); } catch {} }


/** 회원가입: POST /user (JSON body) */
export async function signUp({ userLoginId, password, email, nickName, categories }) {
  const payload = {
    userLoginId,
    password,
    email,
    nickName,
    categories, // 배열 그대로 전달
  };

  // JSON body로 전송
  console.log(payload);

  const res = await api.post("/user", payload);
  console.log(res.data);
  return res.data; // { userId, message }
}

// export async function login({ username, password }) {
//   const res = await api.post(
//     "/api/login",
//     qs.stringify({ username, password }),
//     {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       withCredentials:true
//     }
//   );
//   return res.data;
// }

// CSRF 쿠키(XSRF-TOKEN) 받기
export async function initCsrf() {
  try { await api.get("/csrf"); } catch {}
}


/** 로그인: POST /login (JSON body) */
export async function login({ username, password }) {
  await initCsrf(); // ← CSRF가 필요할 때만
  const res = await api.post("/login", { username, password });
  return res.data; // { id, message }
}

/** 로그아웃 */
export async function logout() {
  const res = await api.get("/logout");
  return res.data;
}
