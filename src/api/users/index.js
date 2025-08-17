//닉네임으로 중복확인,내정보 조회

import api from "../client";


/** 닉네임으로 유저 조회 (200=존재/중복, 404=없음/사용가능) */
export async function getUserByNickname(nickname) {
  const res = await api.get(`/user/${encodeURIComponent(nickname)}`);
  return res.data;
}

/** 카테고리 전체 조회 */
export async function fetchCategories() {
  const res = await api.get("/categories");
  return res.data; // [{ categoryId, name, depth, parentCategoryId }, ...]
}

export async function getUserById(userId) {
  const res = await api.get(`/user/${userId}`);
  return res.data;  // { userId, userLoginId, email, nickname, age }
}

// fetchCategories()

// GET /categories 로 서버 카테고리 풀 목록 받기.

// 각 항목: { categoryId: "1.1.2", name: "프론트엔드", depth: 3, parentCategoryId: "1.1" }

// 회원가입 2단계에서 선택한 “소분류 이름” → categoryId로 매핑할 때 사용.