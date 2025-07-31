import{ useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";

const categories = {
  "개발·기술": {
    "개발·프로그래밍": [
      "백엔드",
      "프론트엔드",
      "알고리즘·자료구조",
      "데이터베이스",
      "모바일 앱",
      "프로그래밍 언어",
      "데브옵스·인프라",
      "소프트웨어 테스트",
      "개발 도구",
      "웹 퍼블리싱",
      "데스크톱 앱 개발",
      "VR/AR",
      "개발·프로그래밍 자격증",
    ],
    "AI 개발": ["AI에이전트 개발", "딥러닝·머신러닝", "컴퓨터 비전", "자연어 처리"],
    "AI 활용": ["AI 업무 활용", "AI 크리에이티브"],
    "게임 개발": ["게임 프로그래밍", "게임 기획", "게임 아트·그래픽"],
    "데이터 사이언스": [
      "데이터 분석",
      "데이터 엔지니어링",
      "데이터 사이언스 자격증",
    ],
    "보안·네트워크": [
      "보안",
      "네트워크",
      "시스템·운영체제",
      "클라우드",
      "블록체인",
      "보안·네트워크 자격증",
    ],
    하드웨어: [
      "컴퓨터 구조",
      "임베디드·IoT",
      "반도체",
      "로봇공학",
      "모빌리티",
      "하드웨어 자격증",
    ],
  },

  "디자인·콘텐츠 제작": {
    "디자인·아트": ["CAD·3D 모델링", "UI/UX", "그래픽 디자인", "디자인 자격증"],
    "콘텐츠 제작": ["웹툰·이모티콘", "사진·영상", "사운드"],
  },

  "비즈니스·실무": {
    "기획·경영·마케팅": [
      "기획·PM·PO",
      "마케팅",
      "경영·전략",
      "기획·경영·마케팅 자격증",
    ],
    "업무 생산성": ["업무 자동화", "오피스", "생산성 도구"],
  },

  "커리어·교육": {
    "커리어·자기계발": [
      "취업·이직",
      "창업·부업",
      "개인 브랜딩",
      "외국어",
      "금융·재테크",
      "교양·예절",
    ],
    대학교육: ["수학", "공학", "상경", "자연과학"],
  },
};

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
      <TopHeader nickname={nickname} />
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

        <SignUpButton onClick={() => navigate("/login")}>회원가입</SignUpButton>
      </Container>
    </>
  );
}

export default SignUp2;
