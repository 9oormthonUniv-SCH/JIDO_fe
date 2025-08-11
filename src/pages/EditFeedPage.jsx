import {useParams,useNavigate} from "react-router-dom";
import {useEffect,useState} from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import categories from "../data/categories";

const AllContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fafdfb;
  padding: 40px 20px;
  margin-top:80px;
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
  height: 28px;
  background: white;
  border: 1px solid #c3d4ce;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
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
  width: 50%;
`;

function EditFeedPage(){
    const{id}=useParams();
    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const [levels, setLevels] = useState([]);
    const navigate=useNavigate();
    const [nickname, setNickname] = useState("");

    const [firstSelect, setFirstSelect] = useState(null);
    const [secondSelect, setSecondSelect] = useState(null);
    const [thirdSelect, setThirdSelect] = useState(null);


    useEffect(()=>{
       const storedNickname = localStorage.getItem("nickname");
         if (storedNickname) setNickname(storedNickname);
       const roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || [];
        const postId = Number(id);

        if(postId >= 0 && postId < roadmaps.length){
            const post = roadmaps[postId];
            setTitle(post.title);
            setDescription(post.description);
            setLevels(post.levels);
        }
    },[]);

   const handleSave = () => {
     const roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || [];
     const postId =Number(id);

     roadmaps[postId]={...roadmaps[postId],title,description,levels};

     localStorage.setItem("roadmaps",JSON.stringify(roadmaps));
     navigate(`/roadmap/${postId}`);

  
   }

    return(
    <>
     <TopHeader nickname={nickname}/>
     <AllContainer>
      <InputSection>
        <MakeTitle>제목</MakeTitle>
        <TitleBox value={title} onChange={(e) => setTitle(e.target.value)} />

        <MakeTitle>카테고리 선택</MakeTitle>
        <CheckboxContainer>
       {/* 첫번쨰 체크리스트 */}
        <CheckColumn>
            {Object.keys(categories).map((main)=>(
                <label key = {main}>
                <input type="checkbox" checked={firstSelect ===main} 
                onChange={()=>{setFirstSelect(main);
                            setSecondSelect(null); setThirdSelect(null);}}/>
                {main}
                </label> ))}
        </CheckColumn>

        {/* 두번쨰 체크리스트 */}
        <CheckColumn>
            {firstSelect && Object.keys(categories[firstSelect]).map((middle)=>(
                <label key={middle}>
                    <input type="checkbox" checked={secondSelect == middle}
                      onChange={()=>{setSecondSelect(middle); 
                                     setThirdSelect(""); }}/>
                </label>
            ))}
        </CheckColumn>

        {/* 세번째 체크리스트 */} 
        <CheckColumn>
            {firstSelect && secondSelect && object.keys(categories[firstSelect][secondSelect]).map((sub)=>(
                <label key={sub}>
                    <input type="checkbox" checked={thirdSelect===sub} onChange={()=>{setThirdSelect(sub)}}/>
                </label>

            )) }
        </CheckColumn>
       </CheckboxContainer>


        <MakeTitle>설명</MakeTitle>
        <TextBox value={description} onChange={(e) => setDescription(e.target.value)} />
      </InputSection>

      <NewLevelButton onClick={addLevel}>+ 새로운 단계 추가하기</NewLevelButton>

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
                const updated = [...levels];
                updated[idx].steps[sIdx].title = e.target.value;
                setLevels(updated);
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
              <AddButton onClick={() => handleAddChecklist(idx, sIdx)}>＋</AddButton>
            </CheckListContainer>
          </RoadmapBox>
        ))}
      </RoadmapList>
    </LevelBlock>
  ))}
</RoadmapContainer>

      <SaveButton onClick={handleSave}>수정 완료</SaveButton>
    </AllContainer>
    </>

    );
}
 export default EditFeedPage;