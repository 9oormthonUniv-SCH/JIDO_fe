import api from "./client";

// ✅ 관심사 조회
export async function getUserInterests(userId) {
  const res = await api.get(`/user-interests/${userId}`);
  return res.data;
}

// ✅ 관심사 삭제
export async function deleteUserInterest(categoryId) {
  const res = await api.delete(`/user-interests/${categoryId}`);
  return res.data;
}

// ✅ 관심사 추가
export async function addUserInterest(categoryId) {
  return (await api.post(`/user-interests/${categoryId}`)).data;
}
