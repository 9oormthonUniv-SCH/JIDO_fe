import api from "../client";

/** 회원가입: POST /user (query 방식) */
export async function signUp({ userLoginId, password, email, nickName, age, categories }) {
  // qs는 URLSearchParams 인스턴스예요.
  const qs = new URLSearchParams();
  qs.append("userLoginId", userLoginId);
  qs.append("password", password);
  qs.append("email", email);
  qs.append("nickName", nickName);
  qs.append("age", String(Number(age) || 0));   // 숫자로 정규화

  // Swagger처럼 키 반복으로 직렬화
  (categories || []).forEach(c => qs.append("categories", c));

  // 바디는 비우고, 쿼리스트링만 붙여서 전송
  //URLSearchParams에 모아둔 값들을 쿼리스트링 문자열로 반환
  const res = await api.post(`/user?${qs.toString()}`);
  return res.data; // { userId, message }
}

/** 로그인: POST /api/login (JSON body) */
export async function login({ username, password }) {
  const res = await api.post("/api/login", { username, password });
  return res.data; // { id, message }
}

/** 로그아웃 */
export async function logout() {
  const res = await api.get("/api/logout");
  return res.data;
}


// signUp(...)

// 스웨거 요구대로 쿼리스트링으로 직렬화해서 POST /user 호출.

// categories 배열은 같은 키 반복으로 직렬화:

// 예: ...&categories=1.1.2&categories=1.5.1

// 최종 동작:

// URLSearchParams에 userLoginId, password, email, nickName, age 추가

// categories 각각 append("categories", 값)

// api.post("/user?"+qs) (바디 없음)

// 응답 { userId, message } 리턴

// ⚠️ 로그인 함수는 api.post("/login", ...) 이어야 최종 /api/login으로 감. (/api/login으로 쓰면 /api/api/login이 되어버림)