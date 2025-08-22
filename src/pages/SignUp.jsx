
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUserByNickname } from "../api/users"; 

const Container = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  margin-bottom:30px;

`;

const Logo = styled.h1`
  font-size:32px;
  font-weight:bold;
  color:black;
  cursor:pointer;
  margin-bottom:40px;
  margin-top:90px;
`;

const Title = styled.h2`
  font-size:24px;
  font-weight:bold;
  color:#2e5c4d;
  margin-bottom:30px;
`;

const LoginContainer = styled.div`
 width:400px;
  display:flex;
  flex-direction:column;

`;

const Label = styled.label`
  font-weight:bold;
  margin-bottom:6px;
  font-size:14px;
  color:black;
`;

//닉네임 중복확인 전체 컨테이너
const NicknameContainer=styled.div`
 display:flex;
 justify-content:center;
 align-items:center;
 gap:10px;


`;
//닉네임창
const NicknameInput=styled.input`
  border-radius:8px;
  border:1px solid #c3d4ce;
  margin-bottom:20px;
  font-size:14px;
  outline:none;
 height:38px;
  &:focus{border: 2px solid #2e5c4d;}
  flex:1;
`;
//중복확인버튼
const CheckButton=styled.div`
   border-radius:8px;
  border:1px solid #c3d4ce;
  margin-bottom: 20px;
  font-size:14px;
  outline:none;
  width:60px;
  background:#fafdfb;
  color:#2e5c4d;
  display:flex;
  justify-content:center;
  align-items:center;
  cursor:pointer;
  height:39px;
  font-weight:bold;
  border:2px solid #2e5c4d;
  &:hover{background-color:#2e5c4d; color:white;}

  

`;



const Input = styled.input`
  border-radius:8px;
  border:1px solid #c3d4ce;
  margin-bottom:20px;
  font-size:14px;
  outline:none;
  height:38px;
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
&:hover{background-color: #24493d;}
`;

function SignUp() {
  const navigate = useNavigate();

  const[nickname,setNickname]=useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [userLoginId, setUserLoginId] = useState("");
  const [password, setPassword] = useState("");
  

    // 생년월일 → 나이(만) 대략 계산
  const toAge = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return 20;
    const [y,m,d] = yyyy_mm_dd.split("-").map(Number);
    const today = new Date();
    let age = today.getFullYear() - y;
    const md = (today.getMonth()+1)*100 + today.getDate();
    if (md < m*100 + d) age -= 1;
    return Math.max(age, 0);
  };

const checkNickname = async () => {
  if (!nickname.trim()) return alert("닉네임을 입력하세요.");
  
  try {
    await getUserByNickname(nickname); // 200이면 존재한다고 가정
    alert("이미 사용 중인 닉네임입니다.");
  } catch (err) {
    if (err?.response?.status === 404) {
      alert("사용 가능한 닉네임입니다.");
    } else {
      alert("닉네임 확인 중 오류가 발생했습니다.");
      console.error(err);
    }
  }
};

    const goNext = () => {
     if (!nickname || !email || !userLoginId || !password) {
      return alert("필수 항목(닉네임/이메일/아이디/비밀번호)을 입력하세요.");
    }
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("email", email);
    localStorage.setItem("userLoginId", userLoginId);
    localStorage.setItem("password", password);
    localStorage.setItem("age", String(toAge(birthDate)));

    const today = new Date().toLocaleDateString();
    localStorage.setItem("signupDate", today);

    navigate("/signup2");
  };


  return (
    <Container>
      <Logo onClick={() => navigate("/")}>JIDO</Logo>
      <Title>SIGN UP</Title>
      <LoginContainer>
        <Label>닉네임</Label>
        <NicknameContainer>
        <NicknameInput placeholder="닉네임을 입력하세요" value={nickname} onChange={(e) => setNickname(e.target.value)} />
       <CheckButton onClick={checkNickname} >중복 확인</CheckButton>
       </NicknameContainer>


        <Label>생년월일</Label>
        <Input type="date" placeholder="생년월일을 선택하세요" onChange={(e)=> setBirthDate(e.target.value)} />

        <Label>이메일</Label>
        <Input type="email" placeholder="이메일을 입력하세요" onChange={(e)=> setEmail(e.target.value)} />

        <Label>아이디</Label>
        <Input placeholder="아이디를 입력하세요" onChange={(e)=>setUserLoginId(e.target.value)} />

        <Label>비밀번호</Label>
        <Input type="password" placeholder="비밀번호를 입력하세요" onChange={(e)=> setPassword(e.target.value)} />
<Button
  type="button"
  onClick={goNext}>다음</Button>

      </LoginContainer>
    </Container>
  );
}

export default SignUp;
