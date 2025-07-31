import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import Logo from '../components/Logo';

const HeaderContainer=styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  height:60px;
  padding:12px;
  border-bottom:1px solid #a6aea9ff;
  background-color: #fafdfb;


   position: fixed;      /* 화면 위에 고정 */
  top: 0;               /* 최상단 */
  left: 0;
  width: 100%;          /* 가로 전체 차지 */
  z-index: 1000;        /* 다른 요소보다 위에 오게 */

`;

//왼쪽 메뉴들 전체 컨테이너
const Menu=styled.div`
  display: flex;
  align-items: center;
  gap:20px;
`;


const Option=styled.p`
  font-size:12px;
  color:black;
  cursor:pointer;
  font-weight:bold;
  &:hover{font-size: 14px;}
`;

const SearchInput= styled.input`
  border-radius:20px;
  background:white;
  width:500px;
  height:28px;
  font-size:12px;
  border:1px solid black;
`;

//오른쪽 메뉴들(로그인버튼이나 닉네임,알람벨)
const LoginMenu= styled.div`
  display:flex;
  align-items:center;
  gap:12px;
  margin-right:30px;
`;

const UserNickname=styled.button`
  font-size:12px;
  margin:0;
  border:none;
  background:none;
  cursor:pointer;
  font-weight:bold;
  &:hover{text-decoration: underline;}
  display:flex;
  margin-left:30px;

`;

const WelcomeText=styled.p`
  font-size:12px;
  margin:0;
  display:flex;
  align-items:center;
  gap:4px;
`;

const LoginButton=styled.button`
  color:black;
  font-size:12px;
  cursor:pointer;
  background:none;
  border:none;
  &:hover{font-weight: bold;}
  border-radius:30px;
  height:45px;
  background-color:#2e5c4d;
  width:80px;
  color:white;
  
`;

const NoticeBell = styled.button`
  background:none;
  border:none;
  cursor:pointer;
  position:relative;
`;

const NoticeNum = styled.span`
  border-radius:50%;  
  position:absolute;
  top:-5px;
  right:-2px;
  background:red;
  color:white;
  font-size:7px;
  padding:2px 5px;
`;

function TopHeader({ nickname }) {
  const navigate = useNavigate();
  const [noticeCount] = React.useState(3);

  return (
    <HeaderContainer>

      <Menu>
        <Logo onClick={() => navigate('/')} />
        <Option onClick={() => navigate('/')}>로드맵 목록</Option>
        <Option onClick={() => navigate('/mypage')}>나의 로드맵</Option>
        <Option onClick={() => navigate('/newfeed')}>로드맵 만들기</Option>
        <SearchInput placeholder="🔍 검색" />
      </Menu>

   
      <LoginMenu>
        {nickname ? (
          <WelcomeText>
            <UserNickname onClick={() => navigate('/myinfo')}>{nickname}</UserNickname>
            님 환영합니다!
            <NoticeBell onClick={() => navigate('/noticepage')}>
              <FaBell size={18} />
              {noticeCount > 0 && <NoticeNum>{noticeCount}</NoticeNum>}
            </NoticeBell>
          </WelcomeText>
        ) : (
          <>
            <LoginButton onClick={() => navigate('/login')}>로그인</LoginButton>
          </>
        )}
      </LoginMenu>
    </HeaderContainer>
  );
}

export default TopHeader;
