// src/pages/MyInfo.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { getUserById } from "../api/users";

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafdfb;
  margin-top: 150px;
  padding: 20px;
  align-items: center;
`;

const TopInfo = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;
  margin-bottom: 30px;
  justify-content: flex-start;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserName = styled.p`
  font-weight: bold;
  color: black;
  font-size: 28px;
  margin: 0;
`;

const SignupDate = styled.p`
  font-size: 15px;
`;

const ChangeContainer = styled.div`
  display: flex;
  width: 500px;
  gap: 20px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  align-items: center;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 20px;
  color: black;
`;

const Input = styled.div`
  background-color: white;
  font-size: 16px;
  border: 1px solid #c3d4ce;
  border-radius: 8px;
  height: 30px;
  padding: 5px;
  width: 550px;
`;

const EditMyInfoB = styled.button`
  margin-top: 20px;
  font-size: 16px;
  background: #2e5c4d;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 40px;
  cursor: pointer;
  font-weight: bold;
  width: 250px;

  &:hover {
    background-color: #24493d;
  }
`;

const LogoutButton = styled.button`
  color: #2e5c4d;
  border: none;
  background: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
  display: flex;
  margin-top: 20px;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 500px;
  justify-content: center;
`;

const CategoryItem = styled.div`
  background: #e3e3e3;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
`;

function MyInfo() {
  const [nickname, setNickname] = useState("");
  const [signupDate, setSignupDate] = useState("");
  const [email, setEmail] = useState("");
  const [userLoginId, setUserLoginId] = useState("");
  const [password, setPassword] = useState(""); // 저장된 게 있으면 표시용
  const [selectedList, setSelectedList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userIdStr = localStorage.getItem("userId");

    (async () => {
      try {
        const userId = Number(userIdStr);
        const u = await getUserById(userId);
        setNickname(u?.nickname ?? "");
        setEmail(u?.email ?? "");
        setUserLoginId(u?.userLoginId ?? "");
        // 필요 시 가입일/관심카테고리도 여기서 세팅
        // setSignupDate(u?.createdAt?.slice(0,10) ?? "");
        // setSelectedList(u?.categories ?? []);
      } catch (err) {
        console.error("내 정보 조회 실패:", err?.response || err);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch (e) { console.warn("서버 로그아웃 실패(무시 가능):", e?.response || e); }
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <>
      <TopHeader nickname={nickname} />
      <TotalContainer>
        <TopInfo>
          {/* 🔻 사진 제거: 이름/가입일만 표시 */}
          <Container>
            <UserName>{nickname || userLoginId || "사용자"}</UserName>
            {signupDate && <SignupDate>가입일: {signupDate}</SignupDate>}
          </Container>
        </TopInfo>

        <ChangeContainer>
          <LoginContainer>
            <div>
              <Label>이메일</Label>
              <Input>{email}</Input>
            </div>
            <div>
              <Label>아이디</Label>
              <Input>{userLoginId}</Input>
            </div>
          </LoginContainer>
        </ChangeContainer>

        <h3>관심 카테고리</h3>
        <CategoryList>
          {selectedList.length > 0 ? (
            selectedList.map((list, idx) => <CategoryItem key={idx}>{list}</CategoryItem>)
          ) : (
            <p>선택된 관심 카테고리가 없습니다.</p>
          )}
        </CategoryList>

        <EditMyInfoB onClick={() => navigate("/infoupdate")}>내 정보 수정</EditMyInfoB>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </TotalContainer>
    </>
  );
}

export default MyInfo;
