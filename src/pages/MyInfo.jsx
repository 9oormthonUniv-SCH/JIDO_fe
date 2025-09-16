// src/pages/MyInfo.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { getUserById } from "../api/users";

const TotalContainer = styled.div`
  --brand: #2e5c4d;
  --ink: #0f172a;
  --muted: #667085;

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #fafdfb;
  margin: 120px auto 80px;
  padding: 24px;

  /* 화면 가운데 카드 레이아웃 */
  max-width: 840px;
`;

const TopInfo = styled.div`
  width: 100%;
  max-width: 640px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-top: 32px;
  margin-bottom: 24px;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

/* 공용 필드 박스 스타일 */
const BaseField = styled.div`
  background: #ffffff;
  color: var(--ink);
  font-size: 16px;
  border: 1px solid rgba(16, 24, 40, 0.14);
  border-radius: 12px;
  padding: 12px 14px;
  width: 100%;
  box-shadow:
    0 1px 1px rgba(16,24,40,0.04),
    0 8px 24px rgba(46,92,77,0.08);
`;

/* 닉네임도 박스 형태로 */
const UserName = styled(BaseField)`
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.2px;
`;

/* 가입일은 보조 텍스트 */
const SignupDate = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--muted);
`;

/* 아래 입력 정보 래퍼 */
const ChangeContainer = styled.div`
  width: 100%;
  max-width: 640px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
  align-items: stretch;
`;

/* 라벨 */
const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 800;
  font-size: 14px;
  color: var(--ink);
  letter-spacing: -0.1px;
`;

/* 이메일/아이디 박스 */
const Input = styled(BaseField)`
  /* 그대로 사용 */
`;

/* 액션 버튼 */
const EditMyInfoB = styled.button`
  margin-top: 24px;
  font-size: 16px;
  background: var(--brand);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 700;
  min-width: 220px;

  &:hover { background-color: #24493d; }
`;

const LogoutButton = styled.button`
  color: var(--brand);
  border: none;
  background: none;
  font-size: 14px;
  margin-top: 14px;
  cursor: pointer;

  &:hover { text-decoration: underline; }
`;

/* 관심 카테고리 */
const CategoryList = styled.div`
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
`;

const CategoryItem = styled.div`
  background: linear-gradient(180deg, #f4f8f6, #ffffff);
  border: 1px solid rgba(46, 92, 77, 0.22);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 700;
  color: #1f2a2a;
  box-shadow: 0 1px 1px rgba(16,24,40,0.04);
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
          <Container>
            <Label>닉네임</Label>
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
