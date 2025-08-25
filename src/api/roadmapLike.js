// src/api/roadmapLike.js
import api from "./client";

/** 로드맵 좋아요 추가 */
export async function addLike(roadmapId) {
  const res = await api.post(`/roadmaps/${roadmapId}/like`,);
  return res.data;
}

/** 로드맵 좋아요 취소 */
export async function removeLike(roadmapId) {
  const res = await api.delete(`/roadmaps/${roadmapId}/like`, {
    });
  return res.data;
}
// export async function likeRoadmap(roadmapId) {
//   return (await api.post(`/roadmaps/${roadmapId}/like`)).data;
// }
// export async function unlikeRoadmap(roadmapId) {
//   return (await api.delete(`/roadmaps/${roadmapId}/like`)).data;
// }
/** 로드맵 북마크 추가 */
export async function addBookmark(roadmapId) {
  const res = await api.post(`/roadmaps/${roadmapId}/bookmark`);
  return res.data;
}

/** 로드맵 북마크 취소 */
export async function removeBookmark(roadmapId) {
  const res = await api.delete(`/roadmaps/${roadmapId}/bookmark`);
  return res.data;
}

// 좋아요 현재 상태 조회
export async function fetchLikeStatus(roadmapId) {
  const { data } = await api.get(`/roadmaps/${roadmapId}/like`, {
    withCredentials: true,
  });
  return data; // { liked, likeCount }
}

// 북마크 현재 상태 조회
export async function fetchBookmarkStatus(roadmapId) {
  const { data } = await api.get(`/roadmaps/${roadmapId}/bookmark`, {
    withCredentials: true,
  });
  return data; // { bookmarked, bookmarkCount }
}