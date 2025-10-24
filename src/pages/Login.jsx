// src/pages/Login.jsx
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState,useEffect} from "react";
import { login } from "../api/auth";
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
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  background-color:#fafdfb;
`;
const Logo = styled.h1`
  font-size:32px;
  font-weight:bold;
  margin-bottom:40px;
  color:black;
  cursor:pointer;
  margin-top:80px;
`;
const Title = styled.h2`
  font-size:24px;
  font-weight:bold;
  color:#2e5c4d;
  margin-bottom:30px;
`;
const LoginContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;
const Label=styled.label`
  font-weight:bold;
  margin-bottom:6px;
  font-size:14px;
  color:black;
  display: block;  
`;
const Input = styled.input`
  height:38px;
  border-radius:8px;
  border:1px solid #c3d4ce;
  margin-bottom:20px;
  font-size:14px;
  outline:none;
  &:focus{border: 2px solid #2e5c4d;}
`;
const Button = styled.button`
  width:100%;
  background-color:#2e5c4d;
  color:white;
  font-weight:bold;
  border:none;
  border-radius:20px;
  height:45px;
  font-size:16px;
  cursor:pointer;
  &:hover{background-color:#24493d;}
`;
const SignupMentCon = styled.div`
  display:flex;
  align-items:center;
  margin-top:20px;
  font-size:14px;
  color: #616564ff;
`;
const SignupLink = styled.p`
  color:#2e5c4d;
  font-weight:bold;
  margin-left:4px;
  cursor: pointer;
  &:hover{text-decoration:underline;}
`;


const ErrorBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fdecea;
  color: #c62828;
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -45%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }
`;
function Login() {
  const navigate = useNavigate();
  const [userLoginId, setUserLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ 에러 메시지 상태

  // ✅ 에러 메시지 2초 뒤 자동 제거
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 2000);
      return () => clearTimeout(timer); // cleanup
    }
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userLoginId || !password) {
      setErrorMessage("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(""); // 기존 에러 초기화

      const res = await login({ username: userLoginId, password });
      const userId = Number(res?.userId ?? res?.id);
      if (!userId) throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");

      const nickname = res?.nickName ?? res?.nickname ?? userLoginId;
      localStorage.setItem("userId", String(userId));
      localStorage.setItem("nickname", nickname);

      window.dispatchEvent(new Event("auth-change"));
      navigate("/");
    } catch (err) {
      console.error(err?.response || err);
      setErrorMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate("/")}>
        <FaArrowLeft />
      </BackButton>
      <Logo onClick={() => navigate("/")}>JIDO</Logo>
      <Title>LOGIN</Title>

      <LoginContainer onSubmit={handleSubmit}>
        <Label>아이디</Label>
        <Input
          type="text"
          placeholder="아이디를 입력하세요"
          value={userLoginId}
          onChange={(e) => setUserLoginId(e.target.value)}
          disabled={loading}
        />

        <Label>비밀번호</Label>
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </LoginContainer>

      <SignupMentCon>
        아직 회원이 아니신가요?
        <SignupLink onClick={() => navigate("/signup")}>회원가입</SignupLink>
      </SignupMentCon>

      {/* ✅ 에러 메시지 박스 */}
      {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
    </Container>
  );
}

export default Login;
