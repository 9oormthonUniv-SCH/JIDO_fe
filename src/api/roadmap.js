// src/api/roadmap.js
import api from "./client.js";

//로드맵
export async function createRoadmap({ authorId, title, description, category, isPublic }) {
  const res = await api.post("/roadmaps", {
    authorId,          
    title,
    description,
    category,
    isPublic,
    sections:[],   
  });
  return res.data;
}

//레벨
export async function createSection(roadmapId, title, sectionNum) {
  const body = { 
    roadmap: { roadmapId },   
    title, 
    sectionNum 
  };
  console.log("[REQ] POST /sections", body);

  const res = await api.post("/sections", body);
  console.log("[RES] /sections", res.status, res.data);

  return res.data;
}

//스텝
export async function createStep(sectionId, title, stepNumber) {
  const body = { 
    roadmapSection: { sectionId },  
    title, 
    stepNumber 
  };  
  console.log("[REQ] POST /steps", body);

  const res = await api.post("/steps", body);
  console.log("[RES] /steps", res.status, res.data);

  return res.data;
}

//체크리스트
export async function createStepContent(stepId, content, finished = false) {
  const body = { 
    step: { stepId },  
    content, 
    finished 
  };  
  console.log("[REQ] POST /step-contents", body);

  const res = await api.post("/step-contents", body);
  console.log("[RES] /step-contents", res.status, res.data);

  return res.data;
}


//로드맵 조회용

//모든 로드맵-홈화면을위한ㄱ어
export async function listRoadmaps() {
  const res = await api.get("/roadmaps");
  return res.data; // [{roadmapId, title, description, category, author: {...}, likes, scraps}, ...]
}

// 1) 로드맵 단건 조회
export async function getRoadmap(roadmapId) {
  const res = await api.get(`/roadmaps/${roadmapId}`);
  return res.data;
}

// ✅ 모든 섹션 가져오기 (roadmapId로 필터)
export async function listSections(roadmapId) {
  const res = await api.get("/sections");
  // roadmapId로 필터링
  return res.data.filter(s => s.roadmap.roadmapId === Number(roadmapId));
}

// 3) 특정 섹션의 스텝 조회
export async function listSteps(sectionId) {
  const res = await api.get(`/sections/${sectionId}/steps`);
  return res.data;
}

// 4) 특정 스텝의 콘텐츠 조회
export async function listStepContents(stepId) {
  const res = await api.get(`/steps/${stepId}/step-contents`);
  return res.data;
}


//로드맵 가져오기
export async function getRoadmapDetail(roadmapId) {
  const res = await api.get(`/roadmaps/${roadmapId}/detail`);
  return res.data;
}

// ⬇️ 맨 아래 근처에 추가
export async function listCategories() {
  const res = await api.get("/categories");
  return res.data; // [{ categoryId, name, depth, parentCategoryId }]
}

// 로드맵 삭제
export async function deleteRoadmap(roadmapId) {
  const res = await api.delete(`/roadmaps/${roadmapId}`);
  return res.data; // 백엔드가 바디 없으면 undefined라서 호출만 성공하면 OK
}

// 목록
export async function listRoadmapComments(roadmapId) {
  const res = await api.get(`/roadmaps/${roadmapId}/comments`);
  return res.data; // [{ commentId, authorNickname, content, createdAt, updatedAt, likeCount, likedByMe }]
}

// 생성
export async function createRoadmapComment(roadmapId, content, parentId = null) {
  const body = { content };
  if (parentId) body.parentId = parentId;  // 대댓글이면 parentId 포함
  const res = await api.post(`/roadmaps/${roadmapId}/comments`, body);
  return res.data; // { commentId, authorId, authorNickname, ... }
}

// 수정
export async function updateRoadmapComment(roadmapId, commentId, content) {
  const res = await api.put(`/roadmaps/${roadmapId}/comments/${commentId}`, { content });
  return res.data;
}

// 삭제
export async function deleteRoadmapComment(roadmapId, commentId) {
  const res = await api.delete(`/roadmaps/${roadmapId}/comments/${commentId}`);
  return res.data;
}

// 댓글 좋아요 추가
export async function addCommentLike(commentId) {
  const res = await api.post(`/comments/${commentId}/likes`);
  return res.data;
}

// 댓글 좋아요 취소
export async function removeCommentLike(commentId) {
  const res = await api.delete(`/comments/${commentId}/likes`);
  return res.data;
}
