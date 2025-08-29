// src/pages/MyinfoUpdate.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../api/users"; // ✅ PATCH용 함수 추가 임포트

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

const UserName = styled.input`
  font-weight: bold;
  color: black;
  font-size: 28px;
  border: none;
  border-bottom: 1px solid #ccc;
  background: transparent;
  outline: none;
  width: 200px;
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

const Input = styled.input`
  background-color: white;
  font-size: 16px;
  border: 1px solid #c3d4ce;
  border-radius: 8px;
  height: 30px;
  padding: 5px;
  flex: 1;
  display: block;
  width: 550px;
`;

const CompleteButton = styled.button`
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

function MyinfoUpdate() {
  const navigate = useNavigate();

  // 서버에서 받는 값
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  // ⚠️ 이 변수명은 '로그인 아이디(userLoginId)'로 사용합니다.
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // 입력값(수정용)
  const [tempNickname, setTempNickname] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const numericUserId = Number(localStorage.getItem("userId")); // DB상의 userId(정수)
    if (!numericUserId) return;

    (async () => {
      try {
        const u = await getUserById(numericUserId); // GET /user/{id}
        setNickname(u?.nickname ?? "");
        setEmail(u?.email ?? "");
        setUserId(u?.userLoginId ?? "");
        // 비번은 보통 서버에서 안 내려줌(보안). 필요 시 빈값으로 두고 변경만 허용.
        setPassword("");

        setTempNickname(u?.nickname ?? "");
        setTempEmail(u?.email ?? "");
        setTempUserId(u?.userLoginId ?? "");
        setTempPassword(""); // 변경 시에만 입력
      } catch (e) {
        console.error("내 정보 조회 실패:", e?.response || e);
        alert("내 정보를 불러오지 못했습니다.");
      }
    })();
  }, []);

  const handleSave = async () => {
    const numericUserId = Number(localStorage.getItem("userId")); // DB상의 userId(정수)
    if (!numericUserId) return alert("로그인 정보가 없습니다.");

    // 간단한 유효성
    if (!tempNickname?.trim() || !tempEmail?.trim() || !tempUserId?.trim()) {
      return alert("닉네임/이메일/아이디를 모두 입력하세요.");
    }

    try {
      setSaving(true);

      // PATCH /user/{id}
      await updateUser(numericUserId, {
        userLoginId: tempUserId,
        email: tempEmail,
        nickname: tempNickname,
        password: tempPassword || undefined, // 비밀번호 미변경이면 보낼 필요 X
        // age: 0, // 필요 시 추가
      });

      // 로컬 상태/스토리지 동기화
      setNickname(tempNickname);
      setEmail(tempEmail);
      setUserId(tempUserId);
      setPassword(""); // 보안상 클리어

      localStorage.setItem("nickname", tempNickname);
      localStorage.setItem("email", tempEmail);
      localStorage.setItem("userLoginId", tempUserId); // ✅ 로그인 아이디는 userLoginId 키로 저장
      // 비번은 로컬스토리지에 보관하지 않는 것을 권장

      alert("변경사항이 저장되었습니다.");
      navigate("/myinfo");
    } catch (e) {
      console.error(e?.response || e);
      alert("정보 수정 실패. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TopHeader nickname={nickname} />
      <TotalContainer>
        {/* 상단: 이름만 편집 */}
        <TopInfo>
          <Container>
            <UserName
              type="text"
              value={tempNickname}
              onChange={(e) => setTempNickname(e.target.value)}
            />
          </Container>
        </TopInfo>

        <ChangeContainer>
          <LoginContainer>
            <div>
              <Label>이메일</Label>
              <Input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>아이디</Label>
              <Input
                type="text"
                value={tempUserId}
                onChange={(e) => setTempUserId(e.target.value)}
              />
            </div>
            <div>
              <Label>비밀번호(변경 시에만 입력)</Label>
              <Input
                type="password"
                placeholder="변경하지 않으면 비워두세요"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
              />
            </div>
          </LoginContainer>
        </ChangeContainer>

        <CompleteButton onClick={handleSave} disabled={saving}>
          {saving ? "저장 중..." : "변경사항 저장"}
        </CompleteButton>
      </TotalContainer>
    </>
  );
}

export default MyinfoUpdate;
