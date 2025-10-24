import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import categories from "../data/categories";
import { signUp } from "../api/auth";
import { fetchCategories } from "../api/users";
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  margin-bottom: 40px;
  margin-top: 90px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #2e5c4d;
  margin-bottom: 30px;
`;

const SelectedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const SelectedItem = styled.div`
  background: #e3e3e3;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  padding: 6px 12px;
`;

const ChooseBoxContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const ChooseBox = styled.div`
  width: 220px;
  max-height: 400px;
  background-color: #f2f2f2;
  border-radius: 12px;
  padding: 12px;
  overflow-y: auto;
`;

const ChooseOption = styled.p`
  font-size: 15px;
  cursor: pointer;
  color: black;
  &:hover {
    font-weight: bold;
    color: #2e5c4d;
  }
`;

const SignUpButton = styled.button`
  width: 200px;
  background-color: #2e5c4d;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  height: 45px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #24493d;
  }
`;

// ✅ 팝업 메시지 추가
const PopupMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  color: #2e5c4d;
  font-weight: bold;
  padding: 40px 60px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  text-align: center;
  font-size: 20px;
  animation: fadeIn 0.3s ease;
  z-index: 1000;

  @keyframes fadeIn {
    from {opacity: 0; transform: translate(-50%, -48%);}
    to {opacity: 1; transform: translate(-50%, -50%);}
  }
`;

function SignUp2() {
  const [selectFirst, setSelectFirst] = useState(null);
  const [selectSecond, setSelectSecond] = useState(null);
  const [selectThird, setSelectThird] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // ✅ 팝업 표시 상태
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
      const password = localStorage.getItem("password") ?? "";
      const email = localStorage.getItem("email") ?? "";
      const nickName = localStorage.getItem("nickname") ?? "";
      const age = parseInt(localStorage.getItem("age") ?? "20", 10);

      if (!userLoginId || !password || !email || !nickName) {
        return alert("1단계 정보가 없습니다. 다시 진행해주세요.");
      }

      const leafNames = selectedList.map((s) => s.split(">").pop().trim());
      const categoriesPayload = leafNames
        .map(
          (name) =>
            allCategories.find(
              (c) => c.name === name && c.depth === 3
            )?.categoryId
        )
        .filter(Boolean);

      if (categoriesPayload.length === 0) {
        return alert("관심 카테고리를 최소 1개 이상 선택해 주세요.");
      }

      const res = await signUp({
        userLoginId,
        password,
        email,
        nickName,
        age,
        categories: categoriesPayload,
      });

      // ✅ alert 대신 팝업 띄우기
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/login");
      }, 2000); // 2초 뒤 이동

    } catch (e) {
      console.log(e);
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
                <ChooseOption
                  key={sub}
                  onClick={() => handleSelectThird(sub)}
                >
                  {sub}
                </ChooseOption>
              ))}
          </ChooseBox>
        </ChooseBoxContainer>

        <SignUpButton onClick={doSignUp}>회원가입</SignUpButton>
      </Container>

      {showPopup && <PopupMessage>회원가입을 환영합니다 🎉</PopupMessage>}
    </>
  );
}

export default SignUp2;
