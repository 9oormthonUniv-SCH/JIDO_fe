// src/api/notification.js
import api from "./client";

export async function fetchNotifications() {
  const r = await api.get("/notifications");
  return r?.data?.data ?? r?.data ?? [];
}
export async function fetchUnread() {
  const r = await api.get("/notifications/unread");
  return r?.data?.data ?? r?.data ?? [];
}
export async function markAllRead() {
  return (await api.put("/notifications/mark-all-read")).data;
}
export async function markOneRead(id) {
  return (await api.put(`/notifications/${id}/read`)).data;
}
