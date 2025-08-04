import styled from "styled-components";

import { useNavigate } from "react-router-dom";

const Container = styled.aside`
  width: 220px;
  background: white;
  border-radius: 12px;
  padding: 20px 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: sticky; /* 스크롤해도 고정 */
  top: 100px;
`;

const BigCategory = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #2e5c4d;
  margin-bottom: 6px;
  border-left: 4px solid #2e5c4d;
  padding-left: 8px;
`;

const SmallCategory = styled.p`
  font-size: 14px;
  margin: 4px 0;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  color: #444;

  &:hover {
    background: #f4f7f6;
    font-weight: bold;
    color: #2e5c4d;
  }
`;

function SideNav() {
  const navigate = useNavigate();

  return (
    <Container>
      <div>
        <BigCategory>개발·기술</BigCategory>
        <SmallCategory onClick={() => navigate("/roadmapDetail")}>
          개발·프로그래밍
        </SmallCategory>
        <SmallCategory>AI 개발</SmallCategory>
        <SmallCategory>AI 활용</SmallCategory>
        <SmallCategory>게임 개발</SmallCategory>
        <SmallCategory>데이터 사이언스</SmallCategory>
        <SmallCategory>보안·네트워크</SmallCategory>
        <SmallCategory>하드웨어</SmallCategory>
      </div>

      <div>
        <BigCategory>디자인·콘텐츠 제작</BigCategory>
        <SmallCategory>디자인·아트</SmallCategory>
        <SmallCategory>콘텐츠 제작</SmallCategory>
      </div>

      <div>
        <BigCategory>비즈니스·실무</BigCategory>
        <SmallCategory>기획·경영·마케팅</SmallCategory>
        <SmallCategory>업무 생산성</SmallCategory>
      </div>

      <div>
        <BigCategory>커리어·교육</BigCategory>
        <SmallCategory>커리어·자기계발</SmallCategory>
        <SmallCategory>대학교육</SmallCategory>
      </div>
    </Container>
  );
}

export default SideNav;
