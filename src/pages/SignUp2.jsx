import{ useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import categories from "../data/categories"; 
import { signUp } from "../api/auth"; 
import { fetchCategories } from "../api/users";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa"; 

const BackButton = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  color: #2e5c4d;
  font-size: 22px;
  &:hover {
    color: #24493d;
  }
`;

const Container=styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
`;

const Logo = styled.h1`
  font-size:32px;
  font-weight:bold;
  color:black;
  cursor:pointer;
  margin-bottom:40px;
  margin-top:90px;
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
  const [allCategories, setAllCategories] = useState([]); // 서버에서 내려온 전체 카테고리
  const navigate = useNavigate();

 useEffect(() => {
  fetchCategories().then(setAllCategories).catch(console.error);
 }, []);

  const handleSelectThird = (sub) => {
    const item = `${selectFirst} > ${selectSecond} > ${sub}`;
    if (!selectedList.includes(item)) {
      setSelectedList((prev) => [...prev, item]);
    }
    setSelectThird(sub);
  };

  const doSignUp = async () => {
    try {
      const userLoginId = localStorage.getItem("userLoginId") ?? "";
      const password    = localStorage.getItem("password") ?? "";
      const email       = localStorage.getItem("email") ?? "";
      const nickName    = localStorage.getItem("nickname") ?? ""; // 대문자 N 중요!
      const age         = parseInt(localStorage.getItem("age") ?? "20", 10);

      if (!userLoginId || !password || !email || !nickName) {
        return alert("1단계 정보가 없습니다. 다시 진행해주세요.");
      }

          // 선택한 라벨 ["대 > 중 > 소"] → 소분류명만 추출 → 카테고리 ID로 매핑
   const leafNames = selectedList.map(s => s.split(">").pop().trim());
     const categoriesPayload = leafNames
       .map(name => allCategories.find(c => c.name === name && c.depth === 3)?.categoryId)
       .filter(Boolean); // ex: ["1.1.2", "1.5.1"]

     if (categoriesPayload.length === 0) {
       return alert("관심 카테고리를 최소 1개 이상 선택해 주세요.");
     }

      const res = await signUp({
        userLoginId, //로그인용 아이디
        password,
        email,
        nickName,
        age,
        categories: categoriesPayload,
      });
     //userId는 서버 아이디 res객체가 있으면 그안의 userId속성을 꺼내옴
      alert(`회원가입 성공! (id: ${res?.userId ?? "?"})`);
      navigate("/login");
      
    } catch (e) {
      console.log(e)
      alert("회원가입 실패. 콘솔/네트워크 탭을 확인하세요.");
    }
  };


  return (
    <>
     
      <Container>
          <BackButton onClick={() => navigate("/signup")}>
                  <FaArrowLeft />
                </BackButton>
                      
        <Logo onClick={() => navigate("/")}>JIDO</Logo>

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
  onClick={doSignUp}> 회원가입</SignUpButton>
      </Container>
    </>
  );
}

export default SignUp2;
