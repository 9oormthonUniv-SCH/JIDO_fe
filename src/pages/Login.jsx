import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

const SignupCotainer = styled.div`
  display:flex;
  flex-direction:column;
  width:100%;
  max-width:400px;
`;

const Label=styled.label`
  font-weight:bold;
  margin-bottom:6px;
  font-size:14px;
  color:black;
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

//회원가입유토 컨테이너
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

function Login() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.setItem("nickname", "테스트유저");
    navigate("/");
  };

  return (
    <Container>
      <Logo onClick={() => navigate("/")}>JIDO</Logo>
      <Title>LOGIN</Title>
      <SignupCotainer onSubmit={handleSubmit}>
        <Label>이메일</Label>
        <Input type="email" placeholder="이메일을 입력하세요" required />

        <Label>비밀번호</Label>
        <Input type="password" placeholder="비밀번호를 입력하세요" required />

        <Button type="submit" onClick={handleSubmit}>로그인</Button>
      </SignupCotainer>
      <SignupMentCon>
        아직 회원이 아니신가요?
        <SignupLink onClick={() => navigate("/signup")}>회원가입</SignupLink>
      </SignupMentCon>
    </Container>
  );
}

export default Login;
