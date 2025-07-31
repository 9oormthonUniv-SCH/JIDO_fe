import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

const categories = { "개발·기술": {"개발·프로그래밍": ["백엔드","프론트엔드","알고리즘·자료구조",
                                                    "데이터베이스","모바일 앱","프로그래밍 언어",
                                                    "데브옵스·인프라","소프트웨어 테스트","개발 도구",
                                                    "웹 퍼블리싱","데스크톱 앱 개발","VR/AR","개발·프로그래밍 자격증",],
    "AI 개발": ["AI에이전트 개발", "딥러닝·머신러닝", "컴퓨터 비전", "자연어 처리"],
    "AI 활용": ["AI 업무 활용", "AI 크리에이티브"],
    "게임 개발": ["게임 프로그래밍", "게임 기획", "게임 아트·그래픽"],
    "데이터 사이언스": ["데이터 분석", "데이터 엔지니어링", "데이터 사이언스 자격증"],
    "보안·네트워크": ["보안","네트워크","시스템·운영체제","클라우드","블록체인","보안·네트워크 자격증",],
    "하드웨어": ["컴퓨터 구조", "임베디드·IoT", "반도체", "로봇공학", "모빌리티", "하드웨어 자격증"],},


  "디자인·콘텐츠 제작": {"디자인·아트": ["CAD·3D 모델링", "UI/UX", "그래픽 디자인", "디자인 자격증"],
                        "콘텐츠 제작": ["웹툰·이모티콘", "사진·영상", "사운드"],},

  "비즈니스·실무": {"기획·경영·마케팅": ["기획·PM·PO", "마케팅", "경영·전략", "기획·경영·마케팅 자격증"],
    "업무 생산성": ["업무 자동화", "오피스", "생산성 도구"],},

  "커리어·교육": {"커리어·자기계발": ["취업·이직", "창업·부업", "개인 브랜딩", "외국어", "금융·재테크", "교양·예절"],
                "대학교육": ["수학", "공학", "상경", "자연과학"],},
};
const AllContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fafdfb;
  min-height: 100vh;
  padding: 40px 20px;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
`;

const MakeTitle = styled.p`
  font-weight: bold;
  color: #2e5c4d;
  margin-bottom: 10px;
  margin-top: 20px;
  font-size: 16px;
`;

const TitleBox = styled.input`
  width: 100%;
  height:28px;
  background: white;
  border: 1px solid #c3d4ce;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  &:focus {
    outline: none;
    border: 2px solid #2e5c4d;
  }
`;

const TextBox = styled.textarea`
  width: 100%;
  height: 120px;
  background: white;
  border: 1px solid #c3d4ce;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  resize: none;
  &:focus {
    outline: none;
    border: 2px solid #2e5c4d;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const CheckColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NewLevelButton = styled.button`
  margin-top: 20px;
  padding: 8px 16px;
  background: #2e5c4d;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #24493d;
  }
`;

const SaveButton = styled.button`
  margin-top: 30px;
  padding: 10px 24px;
  background: #2e5c4d;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #24493d;
  }
    width:50%;
`;

const RoadmapContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  margin-top: 20px;
`;

const LevelBlock = styled.div``;

const LevelTitle = styled.p`
  font-weight: bold;
  font-size: 16px;
  color: #222;
  margin: 10px 0 5px 10px;
`;

const RoadmapList = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 10px;
  overflow-x: auto;
`;

const DashedBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #2e5c4d;
  width: 150px;
  height: 130px;
  border-radius: 10px;
  cursor: pointer;
  min-width: 150px;
  background: #f9fdfb;
`;

const PlusButton = styled.div`
  font-size: 30px;
  color: #2e5c4d;
`;

const RoadmapBox = styled.div`
  border: 1px solid #c3d4ce;
  background: white;
  padding: 12px;
  border-radius: 12px;
  width: 220px;
  min-width: 220px;
`;

const TaskTitleInput = styled.input`
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  border: none;
  border-bottom: 1px solid #c3d4ce;
  margin-bottom: 10px;
  &:focus {
    outline: none;
    border-bottom: 2px solid #2e5c4d;
  }
`;

const CheckListContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
`;

const ChecklistInput = styled.input`
  flex: 1;
  font-size: 14px;
  padding: 6px;
  border: 1px solid #c3d4ce;
  border-radius: 6px;
  &:focus {
    outline: none;
    border: 2px solid #2e5c4d;
  }
`;

const AddButton = styled.button`
  width: 28px;
  height: 28px;
  font-size: 16px;
  font-weight: bold;
  background: #f2f2f2;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
`;

const DoneButton = styled.button`
  margin-top: 10px;
  padding: 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  border: none;
  display: flex;
  margin-left: auto;
  background: #2e5c4d;
  color: white;
  cursor: pointer;
`;

function NewFeed() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [levels, setLevels] = useState([]);

  const [firstSelect, setFirstSelect] = useState(null);
  const [secondSelect, setSecondSelect] = useState(null);
  const [thirdSelect, setThirdSelect] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("nickname");
    if (stored) setNickname(stored);
  }, []);

  const addLevel = () => {
    setLevels((prev) => [...prev, { steps: [] }]);
  };

  const addRoadmapBox = (levelIndex) => {
    setLevels((prev) => {
      const updated = [...prev];
      updated[levelIndex].steps.push({ title: "", checklist: [] });
      return updated;
    });
  };

  const handleAddChecklist = (levelIndex, stepIndex) => {
    setLevels((prev) => {
      const updated = [...prev];
      updated[levelIndex].steps[stepIndex].checklist.push("");
      return updated;
    });
  };

  const saveRoadmap = () => {
    const currentStored = JSON.parse(localStorage.getItem("roadmaps")) || [];
    const newRoadmap = {
      title,
      description,
      author: nickname,
      levels,
    };
    localStorage.setItem("roadmaps", JSON.stringify([...currentStored, newRoadmap]));
    navigate("/");
  };

  return (
    <AllContainer>
      <Logo />

      <InputSection>
        <MakeTitle>제목</MakeTitle>
        <TitleBox
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />

        <MakeTitle>카테고리 선택</MakeTitle>
        <CheckboxContainer>
          <CheckColumn>
            {Object.keys(categories).map((main) => (
              <label key={main}>
                <input
                  type="checkbox"
                  checked={firstSelect === main}
                  onChange={() => {
                    setFirstSelect(main);
                    setSecondSelect(null);
                    setThirdSelect([]);
                  }}
                />
                {main}
              </label>
            ))}
          </CheckColumn>

          <CheckColumn>
            {firstSelect &&
              Object.keys(categories[firstSelect]).map((middle) => (
                <label key={middle}>
                  <input
                    type="checkbox"
                    checked={secondSelect === middle}
                    onChange={() => {
                      setSecondSelect(middle);
                      setThirdSelect([]);
                    }}
                  />
                  {middle}
                </label>
              ))}
          </CheckColumn>

          <CheckColumn>
            {secondSelect &&
              categories[firstSelect][secondSelect].map((sub) => (
                <label key={sub}>
                  <input
                    type="checkbox"
                    checked={thirdSelect.includes(sub)}
                    onChange={() => {
                      if (thirdSelect.includes(sub)) {
                        setThirdSelect(thirdSelect.filter((item) => item !== sub));
                      } else {
                        setThirdSelect([...thirdSelect, sub]);
                      }
                    }}
                  />
                  {sub}
                </label>
              ))}
          </CheckColumn>
        </CheckboxContainer>

        <MakeTitle>설명</MakeTitle>
        <TextBox
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="설명을 입력하세요"
        />

        <NewLevelButton onClick={addLevel}>+ 새로운 단계 추가하기</NewLevelButton>
      </InputSection>

      <RoadmapContainer>
        {levels.map((level, idx) => (
          <LevelBlock key={idx}>
            <LevelTitle>Lv.{idx + 1}</LevelTitle>
            <RoadmapList>
              <DashedBox onClick={() => addRoadmapBox(idx)}>
                <PlusButton>+</PlusButton>
              </DashedBox>

              {level.steps.map((step, sIdx) => (
                <RoadmapBox key={sIdx}>
                  <TaskTitleInput
                    placeholder="제목을 입력하세요"
                    value={step.title}
                    readOnly
                  />
                  {step.checklist.map((item, cIdx) => (
                    <CheckListContainer key={cIdx}>
                      <input type="checkbox" />
                      <ChecklistInput value={item} disabled />
                    </CheckListContainer>
                  ))}
                  <CheckListContainer>
                    <ChecklistInput placeholder="체크리스트를 입력하세요" disabled />
                    <AddButton onClick={() => handleAddChecklist(idx, sIdx)}>＋</AddButton>
                  </CheckListContainer>
                  <DoneButton>완료</DoneButton>
                </RoadmapBox>
              ))}
            </RoadmapList>
          </LevelBlock>
        ))}
      </RoadmapContainer>

      <SaveButton onClick={saveRoadmap}>로드맵 올리기</SaveButton>
    </AllContainer>
  );
}

export default NewFeed;
