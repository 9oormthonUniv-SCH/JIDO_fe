import api from "./client";

export async function fetchNotifications() {
  const r = await api.get(`/notifications?t=${Date.now()}`);
  return r?.data?.data ?? r?.data ?? [];
}
export async function fetchUnread() {
  // 배열을 주는 서버라면 length로 처리, 숫자면 그대로 처리
  const r = await api.get(`/notifications/unread?t=${Date.now()}`);
  return r?.data?.data ?? r?.data ?? [];
}
export async function markAllRead() {
  const r = await api.put("/notifications/mark-all-read");
  return r?.data ?? true;
}
export async function markOneRead(id) {
  const r = await api.put(`/notifications/${id}/read`);
  return r?.data ?? true;
}

export async function deleteRead() {
  const r = await api.delete("/notifications/read");
  return r?.data ?? true;
}
