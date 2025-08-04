import  { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import categories from "../data/categories";  




const AllContainer = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  background-color: #fafdfb;
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
  // align-items:center;
  justify-content:center;
  margin-left:60px;
`;

const CheckColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectMenuContainter =styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    margin-top:30px;
    margin-left:30px;


`;

const SelectMenuBox = styled.div`
   width:550px;
   height:50px;
   background-color: #f2f5f4;
   display:flex;
   align-items:center;
   justify-content:center;
   border-radius:10px;
   border:2px solid #2e5c4d;



`;

const SelectOption =styled.p`
   font-size:15px;
   color: #2e5c4d;


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
  width: 160px;
  height: 160px;
  border-radius: 10px;
  cursor: pointer;
  background: #f9fdfb;
`;

const PlusButton = styled.div`
  font-size: 30px;
  color: #2e5c4d;
`;

const RoadmapBox = styled.div`
  position: relative; /* 삭제 버튼 위치를 절대값으로 두기 위해 추가 */
  border: 1px solid #c3d4ce;
  background: white;
  padding: 12px;
  border-radius: 12px;
  width: 250px;
  padding: 30px;
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

const DeleteButton = styled.button`
  width: 40px;
  height: 40px;
  font-size: 14px;
  font-weight: bold;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #2e5c4d;
  position: absolute;
  top: 8px;
  right: 8px;

  &:hover {
    color: red;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left:auto;
  margin-right:370px;
`;

const Switch = styled.div`
  width: 50px;
  height: 26px;
  background: ${(props) => (props.open ? "#2e5c4d" : "#ccc")};
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
`;

const Knob = styled.div`
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${(props) => (props.open ? "26px" : "2px")};
  transition: left 0.3s;
`;


function NewFeed() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [levels, setLevels] = useState([]);

  const [firstSelect, setFirstSelect] = useState(null);
  const [secondSelect, setSecondSelect] = useState(null);
  const [thirdSelect, setThirdSelect] = useState(null);

  const[openState,setOpenState]=useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nickname");
    if (stored) setNickname(stored);
  }, []);

  const addLevel = () => {setLevels((prev)=>[...prev,{steps:[]}]);};




  const addRoadmapBox = (levelIndex) => {
    setLevels((prev) =>
      prev.map((level, idx) =>
        idx === levelIndex
          ? {
              ...level,
              steps: [...level.steps, { title: "", checklist: [""] }],
            }
          : level
      )
    );
  };

  const handleChecklistChange = (levelIndex, stepIndex, checklistIndex, value) => {
    setLevels((prev) =>
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

  const handleAddChecklist = (levelIndex, stepIndex) => {
    setLevels((prev) =>
      prev.map((level, lIdx) =>
        lIdx === levelIndex
          ? {
              ...level,
              steps: level.steps.map((step, sIdx) =>
                sIdx === stepIndex
                  ? { ...step, checklist: [...step.checklist, ""] }
                  : step
              ),
            }
          : level
      )
    );
  };

  const handleDeleteChecklist = (levelIndex, stepIndex, checklistIndex) => {
    setLevels((prev) =>
      prev.map((level, lIdx) =>
        lIdx === levelIndex
          ? {
              ...level,
              steps: level.steps.map((step, sIdx) =>
                sIdx === stepIndex
                  ? {
                      ...step,
                      checklist: step.checklist.filter(
                        (_, cIdx) => cIdx !== checklistIndex
                      ),
                    }
                  : step
              ),
            }
          : level
      )
    );
  };

  const handleDeleteStep = (levelIndex, stepIndex) => {
    setLevels((prev) =>
      prev.map((level, lIdx) =>
        lIdx === levelIndex
          ? {
              ...level,
              steps: level.steps.filter((_, sIdx) => sIdx !== stepIndex),
            }
          : level
      )
    );
  };

  const handleOpen = () => setOpenState((prev)=> !prev);

 const saveRoadmap = () => {
  const currentStored = JSON.parse(localStorage.getItem("roadmaps")) || [];

  // 카테고리 경로 생성 (대분류 > 중분류 > 소분류)
  const categoryPath = [
    firstSelect,
    secondSelect,
    thirdSelect
  ]
    .filter(Boolean) // null, undefined 제거
    .join(" > ");

  const newRoadmap = { 
    title, 
    description, 
    author: nickname, 
    levels,
    category: categoryPath // 카테고리 정보 저장
  };

  localStorage.setItem("roadmaps", JSON.stringify([...currentStored, newRoadmap]));
  navigate("/");
};

  return (
    <AllContainer>
      <Logo />

      <InputSection>
        <MakeTitle>제목</MakeTitle>
        <TitleBox value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" />

        <MakeTitle>카테고리 선택</MakeTitle>
        <CheckboxContainer>
          <CheckColumn>
            {Object.keys(categories).map((main) => (
              <label key={main}>
                <input type="checkbox" checked={firstSelect === main}
                    onChange={() => { setFirstSelect(main); setSecondSelect(null); setThirdSelect(null);}}/>
                {main}
              </label>
            ))}
          </CheckColumn>

          <CheckColumn>
            {firstSelect &&
              Object.keys(categories[firstSelect]).map((middle) => (
                <label key={middle}>
                  <input type="checkbox" checked={secondSelect === middle} 
                  onChange={() => {setSecondSelect(middle); setThirdSelect(null);}}/>
                  {middle}
                </label>
              ))}
          </CheckColumn>

          <CheckColumn>
            {secondSelect &&
              categories[firstSelect][secondSelect].map((sub) => (
                <label key={sub}>
                  <input type="checkbox" checked={thirdSelect === sub} onChange={() => { setThirdSelect(sub)}}/>
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
        <TextBox value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명을 입력하세요"/>

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
                  <DeleteButton onClick={() => handleDeleteStep(idx, sIdx)}>
                    <FaTrash />
                  </DeleteButton>

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
                      <input type="checkbox" />
                      <ChecklistInput
                        value={item}
                        onChange={(e) =>
                          handleChecklistChange(idx, sIdx, cIdx, e.target.value)
                        }
                        placeholder="체크리스트를 입력하세요"
                      />
                      <button
                        onClick={() =>
                          handleDeleteChecklist(idx, sIdx, cIdx)
                        }
                      >
                        ✕
                      </button>
                    </CheckListContainer>
                  ))}
                  <CheckListContainer>
                    <AddButton onClick={() => handleAddChecklist(idx, sIdx)}>
                      ＋
                    </AddButton>
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


      <SaveButton onClick={saveRoadmap}>로드맵 올리기</SaveButton>
    </AllContainer>
  );
}

export default NewFeed;
