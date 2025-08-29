import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import categories from "../data/categories";
import {
  getRoadmapDetail,
  updateRoadmap,
  updateSection,
  updateStep,
  updateStepContent,
  createSection,
  createStep,
  createStepContent,deleteSection, deleteStep, deleteStepContent,  deleteRoadmap, 
} from "../api/roadmap";

/* ================== NewFeed와 동일한 styled-components ================== */
const AllContainer = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  background-color:#fafdfb;
  padding:40px 20px;
  margin-top:80px;
`;

const InputSection = styled.div`
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  width:100%;
  max-width:600px;
  margin-bottom:30px;
`;

const MakeTitle = styled.p`
  font-weight:bold;
  color:#2e5c4d;
  margin-bottom:10px;
  margin-top:20px;
  font-size:16px;
`;

const TitleBox = styled.input`
  width:100%;
  height:28px;
  background:white;
  border:1px solid #c3d4ce;
  border-radius:8px;
  padding:10px;
  font-size:14px;
  &:focus{ outline:none; border:2px solid #2e5c4d; }
`;

const TextBox = styled.textarea`
  width:100%;
  height:120px;
  background:white;
  border:1px solid #c3d4ce;
  border-radius:8px;
  padding:10px;
  font-size:14px;
  resize:none;
  &:focus{ outline:none; border:2px solid #2e5c4d; }
`;

const CheckboxContainer = styled.div`
  display:flex;
  gap:20px;
  margin-top:10px;
  justify-content:center;
  margin-left:60px;
`;

const CheckColumn = styled.div`
  display:flex;
  flex-direction:column;
  gap:8px;
`;

const SelectMenuContainter = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:30px;
  margin-left:30px;
`;

const SelectMenuBox = styled.div`
  width:550px;
  height:50px;
  background-color:#f2f5f4;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:10px;
  border:2px solid #2e5c4d;
`;

const SelectOption = styled.p`
  font-size:15px;
  color:#2e5c4d;
`;

const NewLevelButton = styled.button`
  margin-top:20px;
  padding:8px 16px;
  background:#2e5c4d;
  color:white;
  border:none;
  border-radius:20px;
  font-size:14px;
  font-weight:bold;
  cursor:pointer;
  &:hover{ background:#24493d; }
`;

const SaveButton = styled.button`
  margin-top:30px;
  padding:10px 24px;
  background:#2e5c4d;
  color:white;
  font-weight:bold;
  border:none;
  border-radius:20px;
  font-size:16px;
  cursor:pointer;
  &:hover{ background:#24493d; }
  width:50%;
`;

const RoadmapContainer = styled.div`
  display:flex;
  flex-direction:column;
  width:100%;
  max-width:900px;
  margin-top:20px;
`;

const LevelBlock = styled.div``;

const LevelTitle = styled.p`
  font-weight:bold;
  font-size:16px;
  color:#222;
  margin:10px 0 5px 10px;
`;

const RoadmapList = styled.div`
  display:flex;
  gap:20px;
  align-items:flex-start;
  padding:10px;
  overflow-x:auto;
`;

const DashedBox = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  border:2px dashed #2e5c4d;
  width:160px;
  height:160px;
  border-radius:10px;
  cursor:pointer;
  background:#f9fdfb;
`;

const PlusButton = styled.div`
  font-size:30px;
  color:#2e5c4d;
`;

const RoadmapBox = styled.div`
  position:relative;
  border:1px solid #c3d4ce;
  background:white;
  padding:30px;
  border-radius:12px;
  width:250px;
`;

const TaskTitleInput = styled.input`
  width:100%;
  font-weight:bold;
  font-size:14px;
  border:none;
  border-bottom:1px solid #c3d4ce;
  margin-bottom:10px;
  &:focus{ outline:none; border-bottom:2px solid #2e5c4d; }
`;

const CheckListContainer = styled.div`
  display:flex;
  gap:8px;
  align-items:center;
  margin-bottom:6px;
`;

const ChecklistInput = styled.input`
  flex:1;
  font-size:14px;
  padding:6px;
  border:1px solid #c3d4ce;
  border-radius:6px;
  &:focus{ outline:none; border:2px solid #2e5c4d; }
`;

const AddButton = styled.button`
  width:28px;
  height:28px;
  font-size:16px;
  font-weight:bold;
  background:#f2f2f2;
  border:none;
  border-radius:6px;
  cursor:pointer;
`;

const DeleteButton = styled.button`
  width:40px;
  height:40px;
  font-size:14px;
  font-weight:bold;
  background:transparent;
  border:none;
  cursor:pointer;
  color:#2e5c4d;
  position:absolute;
  top:8px;
  right:8px;
  &:hover{ color:red; }
`;

const ToggleContainer = styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  margin-left:auto;
  margin-right:370px;
`;

const Switch = styled.div`
  width:50px;
  height:26px;
  background:${(p)=> (p.open ? "#2e5c4d" : "#ccc")};
  border-radius:50px;
  position:relative;
  cursor:pointer;
  transition:background .3s;
`;

const Knob = styled.div`
  width:22px;
  height:22px;
  background:white;
  border-radius:50%;
  position:absolute;
  top:2px;
  left:${(p)=> (p.open ? "26px" : "2px")};
  transition:left .3s;
`;

/* ================== 페이지 컴포넌트 ================== */
function EditFeedPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");

  // 메타
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openState, setOpenState] = useState(true);

  // 카테고리
  const [firstSelect, setFirstSelect] = useState(null);
  const [secondSelect, setSecondSelect] = useState(null);
  const [thirdSelect, setThirdSelect] = useState(null);

  // NewFeed와 동일한 구조: levels = [{ steps: [{ title, checklist: [string], finished[] }]}]
  const [levels, setLevels] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleOpen = () => setOpenState(prev => !prev);
  
  const [serverSnapshot, setServerSnapshot] = useState({
  sectionIds: new Set(),
  stepIds: new Set(),
  contentIds: new Set(),
});


  // ✅ 서버에서 온 category 문자열을 안전하게 세팅
function safeInitCategory(catStr) {
  setFirstSelect(null);
  setSecondSelect(null);
  setThirdSelect(null);
  if (typeof catStr !== "string") return;

  const [a, b, c] = catStr.split(">").map(s => s.trim()).filter(Boolean);

  // 1단
  if (a && Object.prototype.hasOwnProperty.call(categories, a)) {
    setFirstSelect(a);

    const node2 = categories[a];
    // 2단(객체일 때만)
    if (!Array.isArray(node2) && b && Object.prototype.hasOwnProperty.call(node2, b)) {
      setSecondSelect(b);

      const node3 = node2[b];
      // 3단(배열일 때만)
      if (Array.isArray(node3) && c && node3.includes(c)) {
        setThirdSelect(c);
      }
    }
  } else {
    console.warn("[category mismatch]", { catStr, a, b, c });
  }
}

// 🔧 서버 detail → 화면 state(levels) 형태로 변환
function normalizeDetailToLevels(detail) {
  const sections = detail.sections ?? detail.roadmapSections ?? [];
  return sections.map(sec => {
    const steps = sec.steps ?? sec.roadmapSteps ?? [];
    return {
      sectionId: sec.sectionId,
      // 섹션 순서가 필요하면 sec.sectionNum도 추가 가능
      steps: steps.map(st => {
        const contents = st.stepContents ?? st.contents ?? [];
        return {
          stepId: st.stepId,
          title: st.title ?? "",
          stepNumber: st.stepNumber ?? st.order ?? undefined, // 번호 보존(있으면)
          // 화면 입력 구조
          checklist: contents.map(c => c.content ?? ""),
          finished: contents.map(c => !!c.finished),
          // 업데이트/삭제용 내부 id 보관
          _contentIds: contents.map(c => c.stepContentId),
        };
      }),
    };
  });
}

// 🔧 화면의 step 구조 → API 전송용 콘텐츠 배열
function toContentPairs(step) {
  const ids = step._contentIds || [];
  const list = [];
  for (let i = 0; i < (step.checklist || []).length; i++) {
    list.push({
      stepContentId: ids[i],
      content: step.checklist[i],
      finished: (step.finished || [])[i],
    });
  }
  return list;
}

  /* ---------- 초기 데이터 로드 ---------- */
  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) setNickname(storedNickname);

    (async () => {
      const rid = Number(id);
      const detail = await getRoadmapDetail(rid);

      setTitle(detail.title ?? "");
      setDescription(detail.description ?? "");
      setOpenState(!!detail.isPublic);

      // 카테고리
    safeInitCategory(detail.category);
      // detail → NewFeed 형태로 변환

   // detail → NewFeed 형태로 변환
    const lv = normalizeDetailToLevels(detail);
    setLevels(lv);

    // 🟢 서버 스냅샷 기록 (삭제 diff 계산용)
    const secIds = new Set(), stIds = new Set(), ctIds = new Set();
    lv.forEach(sec => {
      if (sec.sectionId) secIds.add(Number(sec.sectionId));
      (sec.steps || []).forEach(st => {
        if (st.stepId) stIds.add(Number(st.stepId));
        (st._contentIds || []).forEach(cid => { 
          if (cid != null) ctIds.add(Number(cid)); 
        });
      });
    });
    setServerSnapshot({ sectionIds: secIds, stepIds: stIds, contentIds: ctIds });
  })();
}, [id]);

const handleDeleteRoadmap = async () => {
  const rid = Number(id);
  if (!window.confirm("정말 이 로드맵을 삭제할까요? (되돌릴 수 없어요)")) return;

  try {
    setSaving(true);

    // 안전하게 최신 상태로 다시 조회해서 모든 ID 수집
    const detail = await getRoadmapDetail(rid);
    const lv = normalizeDetailToLevels(detail);

    const contentIds = [];
    const stepIds = [];
    const sectionIds = [];

    lv.forEach(sec => {
      if (sec.sectionId) sectionIds.push(Number(sec.sectionId));
      (sec.steps || []).forEach(st => {
        if (st.stepId) stepIds.push(Number(st.stepId));
        (st._contentIds || []).forEach(cid => {
          if (cid != null) contentIds.push(Number(cid));
        });
      });
    });

    // 1) 콘텐츠 → 2) 스텝 → 3) 섹션 → 4) 로드맵
    await Promise.all(contentIds.map(deleteStepContent));
    await Promise.all(stepIds.map(deleteStep));
    await Promise.all(sectionIds.map(deleteSection));
    await deleteRoadmap(rid);

    alert("로드맵이 삭제되었습니다.");
    navigate("/"); // 목록 등으로 이동
  } catch (e) {
    console.error("[delete roadmap error]", e);
    alert("삭제 중 오류가 발생했습니다.");
  } finally {
    setSaving(false);
  }
};


  /* ---------- 카테고리 옵션 ---------- */
  const secondOptions = (() => {
    const node = categories[firstSelect];
    if (!node) return [];
    return Array.isArray(node) ? node : Object.keys(node);
  })();
  const thirdOptions = (() => {
    const node = categories[firstSelect]?.[secondSelect];
    if (!node) return [];
    return Array.isArray(node) ? node : Object.keys(node);
  })();

  const buildCategoryValue = () =>
    [firstSelect, secondSelect, thirdSelect].filter(Boolean).join(" > ");

  /* ---------- NewFeed와 같은 편집 UX ---------- */
  const addLevel = () => {
    setLevels(prev => [...prev, { // 신규 섹션(서버에 아직 없음)
      sectionId: undefined,
      steps: []
    }]);
  };

  const addRoadmapBox = (levelIndex) => {
    setLevels(prev =>
      prev.map((level, idx) =>
        idx === levelIndex
          ? {
              ...level,
              steps: [...level.steps, { stepId: undefined, title: "", checklist: [""], finished: [false] }],
            }
          : level
      )
    );
  };

  const handleChecklistChange = (levelIndex, stepIndex, checklistIndex, value) => {
    setLevels(prev =>
      prev.map((level, lIdx) =>
        lIdx === levelIndex
          ? {
              ...level,
              steps: level.steps.map((step, sIdx) =>
                sIdx === stepIndex
                  ? {
                      ...step,
                      checklist: step.checklist.map((item, cIdx) =>
                        cIdx === checklistIndex ? value : item
                      ),
                    }
                  : step
              ),
            }
          : level
      )
    );
  };

  const handleToggleFinished = (levelIndex, stepIndex, checklistIndex, checked) => {
    setLevels(prev =>
      prev.map((level, lIdx) =>
        lIdx === levelIndex
          ? {
              ...level,
              steps: level.steps.map((step, sIdx) =>
                sIdx === stepIndex
                  ? {
                      ...step,
                      finished: step.finished.map((f, cIdx) =>
                        cIdx === checklistIndex ? checked : f
                      ),
                    }
                  : step
              ),
            }
          : level
      )
    );
  };

  const handleAddChecklist = (levelIndex, stepIndex) => {
    setLevels(prev =>
      prev.map((level, lIdx) =>
        lIdx === levelIndex
          ? {
              ...level,
              steps: level.steps.map((step, sIdx) =>
                sIdx === stepIndex
                  ? { ...step, checklist: [...step.checklist, ""], finished: [...(step.finished||[]), false] }
                  : step
              ),
            }
          : level
      )
    );
  };

  const handleDeleteChecklist = (levelIndex, stepIndex, checklistIndex) => {
    setLevels(prev =>
      prev.map((level, lIdx) =>
        lIdx === levelIndex
          ? {
              ...level,
              steps: level.steps.map((step, sIdx) =>
                sIdx === stepIndex
                  ? {
                      ...step,
                      checklist: step.checklist.filter((_, cIdx) => cIdx !== checklistIndex),
                      finished: (step.finished||[]).filter((_, cIdx) => cIdx !== checklistIndex),
                    }
                  : step
              ),
            }
          : level
      )
    );
  };

  const handleDeleteStep = (levelIndex, stepIndex) => {
    setLevels(prev =>
      prev.map((level, lIdx) =>
        lIdx === levelIndex
          ? { ...level, steps: level.steps.filter((_, sIdx) => sIdx !== stepIndex) }
          : level
      )
    );
  };

  /* ---------- 저장 (수정/생성 자동 분기) ---------- */
  const handleSave = async () => {
  const rid = Number(id);
  try {
    setSaving(true);

    // 0) 현재 화면에 남아있는 ID 수집
    const curSecIds = new Set();
    const curStepIds = new Set();
    const curContentIds = new Set();

    levels.forEach(sec => {
      if (sec.sectionId) curSecIds.add(Number(sec.sectionId));
      (sec.steps || []).forEach(st => {
        if (st.stepId) curStepIds.add(Number(st.stepId));
        (st._contentIds || []).forEach(cid => {
          if (cid != null) curContentIds.add(Number(cid));
        });
      });
    });

    // 1) 삭제 대상 계산(서버엔 있었는데 지금은 없음) & 먼저 삭제
    const toDelContents = [...serverSnapshot.contentIds].filter(id => !curContentIds.has(id));
    const toDelSteps    = [...serverSnapshot.stepIds].filter(id => !curStepIds.has(id));
    const toDelSecs     = [...serverSnapshot.sectionIds].filter(id => !curSecIds.has(id));

    await Promise.all(toDelContents.map(deleteStepContent)); // FK: 콘텐츠 먼저
    await Promise.all(toDelSteps.map(deleteStep));          // 그 다음 스텝
    await Promise.all(toDelSecs.map(deleteSection));        // 마지막 섹션

    // 2) 로드맵 메타 업데이트
    const metaTask = updateRoadmap(rid, {
      title,
      description,
      category: buildCategoryValue(),
      isPublic: openState,
    });

    // 3) 추가/수정
    const tasks = [];

    for (const [li, level] of levels.entries()) {
      // 섹션
      let sectionId = level.sectionId;
      if (!sectionId) {
        const created = await createSection(rid, `Lv.${li + 1}`, li + 1);
        sectionId = Number(created?.sectionId);
        if (!sectionId) throw new Error("sectionId 생성 실패");
      } else {
        tasks.push(updateSection(sectionId, { title: `Lv.${li + 1}`, sectionNum: li + 1 }));
      }

      // (선택) stepNumber 충돌 방지
      const usedNumbers = new Set(
        (level.steps || [])
          .map(s => Number(s.stepNumber))
          .filter(n => Number.isFinite(n))
      );
      const nextFree = () => {
        let n = 1;
        while (usedNumbers.has(n)) n++;
        usedNumbers.add(n);
        return n;
      };

      // 스텝 & 콘텐츠
      for (const [si, step] of (level.steps || []).entries()) {
        let stepId = step.stepId;

        const stepNumber =
          step.stepId && Number.isFinite(Number(step.stepNumber))
            ? Number(step.stepNumber)
            : nextFree();

        if (!stepId) {
          const created = await createStep(sectionId, step.title || `Step ${si + 1}`, stepNumber);
          stepId = Number(created?.stepId);
          if (!stepId) throw new Error("stepId 생성 실패");
        } else {
          tasks.push(updateStep(stepId, {
            title: step.title || `Step ${si + 1}`,
            stepNumber,
          }));
        }

        const contents = toContentPairs(step);
        for (const c of contents) {
          if (c.stepContentId) {
            tasks.push(updateStepContent(c.stepContentId, {
              content: c.content,
              finished: !!c.finished,
            }));
          } else if ((c.content || "").trim()) {
            tasks.push(createStepContent(stepId, c.content.trim(), !!c.finished));
          }
        }
      }
    }

    await Promise.all([metaTask, ...tasks]);

    alert("수정 완료!");
    // 성공 후 상세로 이동(가장 쉬운 동기화)
    navigate(`/roadmaps/${rid}`);
  } catch (err) {
    console.error("[edit save error]", err);
    alert("수정 중 오류가 발생했습니다.");
  } finally {
    setSaving(false);
  }
};
  /* ================== UI ================== */
  return (
    <>
      <TopHeader nickname={nickname} />
      <AllContainer>
        {/* 메타 폼 (NewFeed 그대로) */}
        <InputSection>
          <MakeTitle>제목</MakeTitle>
          <TitleBox
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />

          <MakeTitle>카테고리 선택</MakeTitle>
          <CheckboxContainer>
            {/* 1단 */}
            <CheckColumn>
              {Object.keys(categories).map((main) => (
                <label key={main}>
                  <input
                    type="checkbox"
                    checked={firstSelect === main}
                    onChange={() => { setFirstSelect(main); setSecondSelect(null); setThirdSelect(null); }}
                  />
                  {main}
                </label>
              ))}
            </CheckColumn>

            {/* 2단 */}
            <CheckColumn>
              {firstSelect &&
                Object.keys(categories[firstSelect]).map((middle) => (
                  <label key={middle}>
                    <input
                      type="checkbox"
                      checked={secondSelect === middle}
                      onChange={() => { setSecondSelect(middle); setThirdSelect(null); }}
                    />
                    {middle}
                  </label>
                ))}
            </CheckColumn>

            {/* 3단 */}
            <CheckColumn>
              {secondSelect &&
                categories[firstSelect][secondSelect].map((sub) => (
                  <label key={sub}>
                    <input
                      type="checkbox"
                      checked={thirdSelect === sub}
                      onChange={() => setThirdSelect(sub)}
                    />
                    {sub}
                  </label>
                ))}
            </CheckColumn>
          </CheckboxContainer>

          <SelectMenuContainter>
            <SelectMenuBox>
              <SelectOption>
                {firstSelect ? firstSelect : ""}
                {secondSelect && "> " + secondSelect}
                {thirdSelect && ` > ${thirdSelect}`}
              </SelectOption>
            </SelectMenuBox>
          </SelectMenuContainter>

          <MakeTitle>설명</MakeTitle>
          <TextBox
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명을 입력하세요"
          />

          <NewLevelButton onClick={addLevel}>+ 새로운 단계 추가하기</NewLevelButton>
        </InputSection>

        {/* 레벨/스텝/체크리스트 (NewFeed 그대로) */}
        <RoadmapContainer>
          {levels.map((level, idx) => (
            <LevelBlock key={level.sectionId ?? `lvl-${idx}`}>
              <LevelTitle>Lv.{idx + 1}</LevelTitle>

              <RoadmapList>
                <DashedBox onClick={() => addRoadmapBox(idx)}>
                  <PlusButton>+</PlusButton>
                </DashedBox>

                {level.steps.map((step, sIdx) => (
                  <RoadmapBox key={step.stepId ?? `step-${idx}-${sIdx}`}>
                    <DeleteButton onClick={() => handleDeleteStep(idx, sIdx)}>✕</DeleteButton>

                    <TaskTitleInput
                      placeholder="제목을 입력하세요"
                      value={step.title}
                      onChange={(e) => {
                        const newLevels = [...levels];
                        newLevels[idx].steps[sIdx].title = e.target.value;
                        setLevels(newLevels);
                      }}
                    />

                    {step.checklist.map((item, cIdx) => (
                      <CheckListContainer key={cIdx}>
                        <input
                          type="checkbox"
                          checked={(step.finished || [])[cIdx] || false}
                          onChange={(e) =>
                            handleToggleFinished(idx, sIdx, cIdx, e.target.checked)
                          }
                        />
                        <ChecklistInput
                          value={item}
                          onChange={(e) =>
                            handleChecklistChange(idx, sIdx, cIdx, e.target.value)
                          }
                          placeholder="체크리스트를 입력하세요"
                        />
                        <button onClick={() => handleDeleteChecklist(idx, sIdx, cIdx)}>✕</button>
                      </CheckListContainer>
                    ))}

                    <CheckListContainer>
                      <AddButton onClick={() => handleAddChecklist(idx, sIdx)}>＋</AddButton>
                    </CheckListContainer>
                  </RoadmapBox>
                ))}
              </RoadmapList>
            </LevelBlock>
          ))}
        </RoadmapContainer>

        <ToggleContainer>
          <span>{openState ? "공개" : "비공개"}</span>
          <Switch open={openState} onClick={handleOpen}>
            <Knob open={openState} />
          </Switch>
        </ToggleContainer>

        <SaveButton onClick={handleSave} disabled={saving}>
          {saving ? "저장 중..." : "수정 완료"}
        </SaveButton>
      </AllContainer>
    </>
  );
}

export default EditFeedPage;
