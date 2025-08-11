import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { FaCamera } from "react-icons/fa"; // 카메라 아이콘 (react-icons 사용)
import { useNavigate } from "react-router-dom"; 
const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafdfb;
  margin-top: 150px;
  padding: 20px;
  align-items: center;
`;

// 사진+이름+가입일자 컨테이너
const TopInfo = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 40px;
  margin-bottom: 30px;
  justify-content: flex-start;
`;

// 프로필 이미지 + 아이콘 감싸는 컨테이너
const ImgContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
`;

const ImgLabel = styled.label`
  cursor: pointer;
  display: inline-block;
`;

const MyImg = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  background-color: #e6e6e6;
  border: 2px solid #2e5c4d;
  cursor: pointer;
`;

// 카메라 아이콘
const CameraIcon = styled.div`
  position: absolute;
  bottom:8px;
  right:8px;
  background: rgba(46, 92, 77, 0.8);
  color:white;
  padding:8px;
  border-radius:50%;
  font-size:16px;
  display:flex;
  align-items:center;
  justify-content:center;
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

// 이메일, 아이디, 비밀번호 컨테이너
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

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [profileImg, setProfileImg] = useState("");

 //임시
  const [tempNickname, setTempNickname] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [tempProfileImg, setTempProfileImg] = useState("");

  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    const savedEmail = localStorage.getItem("email");
    const savedUserId = localStorage.getItem("userId");
    const savedPassword = localStorage.getItem("password");
    const savedProfileImg = localStorage.getItem("profileImg");

    setNickname(savedNickname);
    setEmail(savedEmail);
    setUserId(savedUserId);
    setPassword(savedPassword);
    setProfileImg(savedProfileImg);

    setTempNickname(savedNickname);
    setTempEmail(savedEmail);
    setTempUserId(savedUserId);
    setTempPassword(savedPassword);
    setTempProfileImg(savedProfileImg);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setNickname(tempNickname);
    setEmail(tempEmail);
    setUserId(tempUserId);
    setPassword(tempPassword);
    setProfileImg(tempProfileImg);

    localStorage.setItem("nickname", tempNickname);
    localStorage.setItem("email", tempEmail);
    localStorage.setItem("userId", tempUserId);
    localStorage.setItem("password", tempPassword);
    localStorage.setItem("profileImg", tempProfileImg);

    alert("변경사항이 저장되었습니다.");
     navigate("/myinfo");
  };

  return (
    <>
      <TopHeader nickname={nickname} />
      <TotalContainer>
        {/*상단 이름이랑 이미지*/}
        <TopInfo>
         <ImgLabel htmlFor="imgUpload">
          <ImgContainer>
            <MyImg src={tempProfileImg || "/default_profile.png"} />
            <CameraIcon>
            <FaCamera />
           </CameraIcon>
          </ImgContainer>
         </ImgLabel>

          <input id="imgUpload" type="file" style={{ display: "none" }} onChange={handleImageChange}/>

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
                type="text"
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
              <Label>비밀번호</Label>
              <Input
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
              />
            </div>
          </LoginContainer>
        </ChangeContainer>

        <CompleteButton onClick={handleSave}>변경사항 저장</CompleteButton>
      </TotalContainer>
    </>
  );
}

export default MyinfoUpdate;
