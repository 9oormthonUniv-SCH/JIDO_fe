import api from "./client";


/**
 * 백엔드 전제:
 * - 세션/쿠키 기반 인증 (client에서 withCredentials=true)
 * - 응답 타입: NotificationResponse[]
 *   { message: string, createdAt: string($date-time), isRead: boolean, url: string, [id?: number] }
 */

// 전체 알림 조회
export async function fetchNotifications() {
  const res = await api.get("/notifications", { withCredentials: true });
  return res.data ?? [];
}

// 안 읽은 알림만 조회
export async function fetchUnread() {
  const res = await api.get("/notifications/unread", { withCredentials: true });
  return res.data ?? [];
}

// 모두 읽음 처리
export async function markAllRead() {
  const res = await api.put("/notifications/mark-all-read", null, {
    withCredentials: true,
  });
  return res.data;
}

// 개별 읽음 처리 (백엔드가 path param을 요구)
export async function markOneRead(notificationId) {
  const res = await api.put(`/notifications/${notificationId}/read`, null, {
    withCredentials: true,
  });
  return res.data;
}

// 읽은 알림 전부 삭제
export async function deleteReadNotifications() {
  const res = await api.delete("/notifications/read", { withCredentials: true });
  return res.data;
}