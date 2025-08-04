import{ useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import categories from "../data/categories";  

const Container=styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  margin-top:100px;
`;

const Title=styled.h2`
  font-size:24px;
  font-weight:bold;
  color:#2e5c4d;
  margin-bottom:30px;
`;

//내가 선택한것들
const SelectedList=styled.div`
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-bottom:20px;
`;

const SelectedItem =styled.div`
  background:#e3e3e3;
  border-radius: 20px;
  font-size:14px;
  font-weight:bold;
`;

const ChooseBoxContainer=styled.div`
  display:flex;
  gap:20px;
  margin-bottom:30px;
`;

const ChooseBox=styled.div`
  width:220px;
  max-height:400px;
  background-color:#f2f2f2;
  border-radius:12px;
  padding:12px;
  overflow-y:auto;
`;

const ChooseOption=styled.p`
  font-size:15px;
  cursor: pointer;
  color:black;

  &:hover {font-weight: bold; color: #2e5c4d;}
`;

const SignUpButton=styled.button`
  width:200px;
  background-color:#2e5c4d;
  color:white;
  font-weight:bold;
  border:none;
  border-radius:20px;
  height:45px;
  font-size:16px;
  cursor:pointer;
  &:hover {background-color: #24493d;}
`;

function SignUp2() {
  const [nickname, setNickname] = useState("");
  const [selectFirst, setSelectFirst] = useState(null);
  const [selectSecond, setSelectSecond] = useState(null);
  const [selectThird, setSelectThird] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const navigate = useNavigate();

  const handleSelectThird = (sub) => {
    const item = `${selectFirst} > ${selectSecond} > ${sub}`;
    if (!selectedList.includes(item)) {
      setSelectedList((prev) => [...prev, item]);
    }
    setSelectThird(sub);
  };

  return (
    <>
      <TopHeader nickname={nickname}/>
      <Container>
        <Title>관심 분야를 선택해주세요</Title>

        <SelectedList>
          {selectedList.map((item, idx) => (
            <SelectedItem key={idx}>{item}</SelectedItem>
          ))}
        </SelectedList>

        <ChooseBoxContainer>
          <ChooseBox>
            {Object.keys(categories).map((main) => (
              <ChooseOption
                key={main}
                onClick={() => {
                  setSelectFirst(main);
                  setSelectSecond(null);
                  setSelectThird(null);
                }}
              >
                {main}
              </ChooseOption>
            ))}
          </ChooseBox>

          <ChooseBox>
            {selectFirst &&
              Object.keys(categories[selectFirst]).map((middle) => (
                <ChooseOption
                  key={middle}
                  onClick={() => {
                    setSelectSecond(middle);
                    setSelectThird(null);
                  }}
                >
                  {middle}
                </ChooseOption>
              ))}
          </ChooseBox>

          <ChooseBox>
            {selectSecond &&
              categories[selectFirst][selectSecond].map((sub) => (
                <ChooseOption key={sub} onClick={() => handleSelectThird(sub)}>
                  {sub}
                </ChooseOption>
              ))}
          </ChooseBox>
        </ChooseBoxContainer>

    <SignUpButton
  onClick={() => { localStorage.setItem("categories", JSON.stringify(selectedList));
                   navigate("/login");
  }}
>
  회원가입
</SignUpButton>
      </Container>
    </>
  );
}

export default SignUp2;
