// src/api/roadmap.js
import api from "./client.js";

/* =========================
 * 생성 (로드맵/섹션/스텝/콘텐츠)
 * ========================= */
export async function createRoadmap({ authorId, title, description, category, isPublic }) {
  const res = await api.post("/roadmaps", {
    authorId,
    title,
    description,
    category,
    isPublic,
    sections: [],
  });
  return res.data;
}

export async function createSection(roadmapId, title, sectionNum) {
  const body = {
    roadmap: { roadmapId: Number(roadmapId) },
    title,
    sectionNum: Number(sectionNum),
  };
  return (await api.post("/sections", body)).data;
}

// ✅ createStep: FK 네이밍 호환(roadmapSection/section/sectionId) 재시도 버전
export async function createStep(sectionId, title, stepNumber) {
  const sId = Number(sectionId);
  const n = Number(stepNumber);
  const safeTitle = (title && String(title).trim()) || "Step";

  const tries = [
    { title: safeTitle, stepNumber: n, roadmapSection: { sectionId: sId } }, // 기본
    { title: safeTitle, stepNumber: n, section: { sectionId: sId } },        // 대안1
    { title: safeTitle, stepNumber: n, sectionId: sId },                      // 대안2
  ];

  let lastErr;
  for (const body of tries) {
    try {
      const res = await api.post("/steps", body);
      const data = res.data || {};
      return { ...data, stepId: data.stepId ?? data.id };
    } catch (e) {
      lastErr = e;
    }
  }
  console.error("[createStep failed]", lastErr?.response?.data || lastErr);
  throw lastErr;
}

export async function createStepContent(stepId, content, finished = false) {
  const body = {
    step: { stepId: Number(stepId) },
    content,
    finished: !!finished,
  };
  return (await api.post("/step-contents", body)).data;
}

/* =========================
 * 조회
 * ========================= */
export async function listRoadmaps() {
  return (await api.get("/roadmaps")).data;
}

export async function getRoadmap(roadmapId) {
  return (await api.get(`/roadmaps/${Number(roadmapId)}`)).data;
}

export async function listSections(roadmapId) {
  const res = await api.get("/sections");
  return res.data.filter((s) => s.roadmap?.roadmapId === Number(roadmapId));
}

export async function listSteps(sectionId) {
  return (await api.get(`/sections/${Number(sectionId)}/steps`)).data;
}

export async function listStepContents(stepId) {
  return (await api.get(`/steps/${Number(stepId)}/step-contents`)).data;
}

export async function getRoadmapDetail(roadmapId) {
  return (await api.get(`/roadmaps/${Number(roadmapId)}/detail`)).data;
}

export async function listCategories() {
  return (await api.get("/categories")).data;
}

/* =========================
 * 댓글/좋아요
 * ========================= */
export async function listRoadmapComments(roadmapId) {
  return (await api.get(`/roadmaps/${Number(roadmapId)}/comments`)).data;
}

// ✅ parentId 전송 조건/타입 보정 (null/undefined가 아닐 때만 전송 + 숫자화)
export async function createRoadmapComment(roadmapId, content, parentId = null) {
  const body = { content };
  // ✅ null/undefined가 아닌 경우에만 parentId 추가 + 숫자변환
  if (parentId !== null && parentId !== undefined) {
    body.parentId = Number(parentId);
  }
  const res = await api.post(`/roadmaps/${Number(roadmapId)}/comments`, body);
  return res.data;
}

// Swagger가 parentId도 받도록 되어 있으므로 옵션으로 허용
export async function updateRoadmapComment(roadmapId, commentId, content, parentId = undefined) {
  const body = { content };
  if (parentId !== undefined && parentId !== null) body.parentId = Number(parentId);
  return (await api.put(`/roadmaps/${Number(roadmapId)}/comments/${Number(commentId)}`, body)).data;
}

export async function deleteRoadmapComment(roadmapId, commentId) {
  return (await api.delete(`/roadmaps/${Number(roadmapId)}/comments/${Number(commentId)}`)).data;
}

export async function addCommentLike(commentId) {
  return (await api.post(`/comments/${Number(commentId)}/likes`)).data;
}

export async function removeCommentLike(commentId) {
  return (await api.delete(`/comments/${Number(commentId)}/likes`)).data;
}

/* =========================
 * 수정
 * ========================= */
export async function updateRoadmap(roadmapId, { title, description, category, isPublic }) {
  const body = { title, description, category, isPublic };
  return (await api.put(`/roadmaps/${Number(roadmapId)}`, body)).data;
}

function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));
}

export async function updateSection(sectionId, { title, sectionNum }) {
  const body = compact({ title, sectionNum: Number(sectionNum) });
  return (await api.put(`/sections/${Number(sectionId)}`, body)).data;
}

export async function updateStep(stepId, { title, stepNumber }) {
  const body = compact({ title, stepNumber: Number(stepNumber) });
  return (await api.put(`/steps/${Number(stepId)}`, body)).data;
}

export async function updateStepContent(stepContentId, { content, finished }) {
  const body = compact({ content, finished: typeof finished === "boolean" ? finished : undefined });
  return (await api.put(`/step-contents/${Number(stepContentId)}`, body)).data;
}

/* =========================
 * 삭제
 * ========================= */
export async function deleteStepContent(stepContentId) {
  return api.delete(`/step-contents/${Number(stepContentId)}`);
}

export async function deleteStep(stepId) {
  return api.delete(`/steps/${Number(stepId)}`);
}

export async function deleteSection(sectionId) {
  return api.delete(`/sections/${Number(sectionId)}`);
}

export async function deleteRoadmap(roadmapId) {
  return api.delete(`/roadmaps/${Number(roadmapId)}`);
}
