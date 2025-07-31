import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";

const TotalContainer=styled.div`
  display:flex;
  flex-direction:column;
  background-color:#fafdfb;
  margin-top:90px;
  padding:20px;
  align-items:center;
`;

//사진+이름이랑가입일자 컨테이너
const TopInfo=styled.div`
  display:flex;
  gap:15px;
  margin-top:40px;
  margin-bottom:30px;
  justify-content: flex-start;  
`;

const MyImg=styled.div`
  border-radius:50%;
  width:80px;
  height:80px;
  background-color:#e6e6e6;
  border:2px solid #2e5c4d;
`;


//이름이랑 가입일 컨테이너
const Container=styled.div`
  display:flex;
  flex-direction:column;
`;

const UserName=styled.p`
  font-weight:bold;
   color:blaxck;
  font-size:22px;
  margin:0;

`;

const SignupDate=styled.p`
  font-size:12px;
`;

//이메일 로그인 컨테이너
const ChangeContainer=styled.div`
  display:flex;
  width:300px;
  gap:20px;
`;

//이메일 비밀번호 창 컨테이너
const LoginContainer=styled.div`
  display:flex;
  flex-direction:column;
  gap:14px;
  flex:1;
`;

// const div=styled.div`
//    display:flex;
//    align-items:center;
//    justify-content:center;
//    flex-direction:column;
//    margin:0;


// `;



const Label=styled.label`
  font-weight:bold;
  font-size:14px;
  color:black;
`;

const Input=styled.input`
  background-color:white;
  font-size:12px;
  border:1px solid #c3d4ce;
  border-radius:8px;
  height: 25px;
  padding:5px;
  flex:1;
  display:block;
  width:300px;
  
  
`;



//내 정보 수정하는 버튼
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

  &:hover{background-color: #24493d;}
`;


function MyinfoUpdate() {

  const[nickname,setNickname]=useState("");

  useEffect(()=>{const stored=localStorage.getItem("nickname"); 
                if(stored) setNickname(stored);
  },[]);

  return (
    <>
      <TopHeader nickname={nickname} />
      <TotalContainer>
        <TopInfo>
          <MyImg />
          <Container>
            <UserName>{nickname}</UserName>
            <SignupDate>가입일: 오래 전...</SignupDate>
          </Container>
        </TopInfo>

        <ChangeContainer>
          <LoginContainer>
            <div>
              <Label>이메일</Label>
              <Input type="text" defaultValue="test@example.com"/>
            </div>

            <div>
              <Label>비밀번호</Label>
             <Input type="text" defaultValue="********"/>
            </div>
          </LoginContainer>

        </ChangeContainer>
        <CompleteButton>변경사항 저장</CompleteButton>
        
      </TotalContainer>
    </>
  );
}

export default MyinfoUpdate;