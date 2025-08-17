// src/api/roadmap.js
import api from "./client.js";

//로드맵
export async function createRoadmap({ authorId, title, description, category, isPublic }) {
  const res = await api.post("/roadmaps", {
    authorId,          // ✅ 추가
    title,
    description,
    category,
    isPublic,
  });
  return res.data;
}

//레벨
export async function createSection(roadmapId, title, sectionNum) {
const body = { 
  roadmap: { roadmapId },   // ✅ 객체 안에 id
  title, 
  sectionNum 
};
  const res = await api.post("/sections", body);
  return res.data;
}


//스텝
export async function createStep(sectionId, title, stepNumber) {
const body = { 
  roadmapSection: { sectionId },  // ✅ 객체 안에 id
  title, 
  stepNumber 
};  const res = await api.post("/steps", body);
  return res.data;
}

//체크리스트
export async function createStepContent(stepId, content, finished = false) {
const body = { 
  step: { stepId },   // ✅ 객체 안에 id
  content, 
  finished 
};  const res = await api.post("/step-contents", body);
  return res.data;
}
