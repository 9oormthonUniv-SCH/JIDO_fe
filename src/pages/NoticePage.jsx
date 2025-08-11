// NoticePage.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { FaHeart, FaComment, FaBookmark, FaBell } from "react-icons/fa";

/* =========================
   1) 화면 레이아웃 / 기본 스타일
   ========================= */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 150px;
  background: #fafdfb;
  min-height: 100vh;
`;

const TopContainer = styled.div`
  width: 800px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  margin: 0;
`;

const MarkAllButton = styled.button`
  border: none;
  background: #2e5c4d;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background: #24493d;
  }

  /* 비활성화 상태(읽을 알림이 없을 때) */
  &:disabled {
    background: #c7d2cc;
    cursor: not-allowed;
  }
`;

const NoticeList = styled.div`
  width: 800px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* 알림 카드: 읽음 여부에 따라 배경/테두리만 바꿔줄 거라 $read만 받음 */
const NoticeContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ $read }) => ($read ? "#ffffff" : "#f1faf6")};
  border: 1px solid ${({ $read }) => ($read ? "#c3d4ce" : "#2ecc71")};
  border-radius: 12px;
  padding: 12px 16px;
  gap: 12px;
`;

/* 아이콘은 색상/투명도만 바꾸면 되므로 $color, $dim 두 가지만 사용 */
const IconContainer = styled.div`
  font-size: 20px;
  color: ${({ $color }) => $color || "gray"};
  opacity: ${({ $dim }) => ($dim ? 0.6 : 1)};
`;

/* 텍스트는 굵기만 바꿈 */
const NoticeText = styled.div`
  flex: 1;
  font-size: 15px;
  color: #333;
  font-weight: ${({ $read }) => ($read ? 400 : 700)};
`;

const NoticeDate = styled.div`
  font-size: 12px;
  color: ${({ $read }) => ($read ? "#aaa" : "#666")};
`;
/* =========================
   2) 간단한 유틸 함수들
   ========================= */

/** type에 맞는 아이콘 컴포넌트를 돌려줌 */
function getIconByType(type) {
  if (type === "like") return <FaHeart />;
  if (type === "comment") return <FaComment />;
  if (type === "bookmark") return <FaBookmark />;
  // 모르는 타입이면 기본 종모양
  return <FaBell />;
}

/** type에 맞는 색상을 돌려줌 */
function getColorByType(type) {
  if (type === "like") return "#e74c3c";     // 빨강
  if (type === "comment") return "#3498db";  // 파랑
  if (type === "bookmark") return "#2ecc71"; // 초록
  return "#555";                              // 기본 회색
}

/* =========================
   3) 메인 컴포넌트
   ========================= */
function NoticePage() {
  const [nickname, setNickname] = useState("");  // 헤더에 표시할 닉네임
  const [notices, setNotices] = useState([]);    // 알림 목록

  // (1) 첫 렌더링 시: 닉네임/알림을 로컬스토리지에서 가져오기
  useEffect(() => {
    // 닉네임 불러오기
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) {
      setNickname(storedNickname);
    }

    // 알림 불러오기
    const saved = localStorage.getItem("notices");

    // 저장된 알림이 없거나, 빈 배열이면 더미 데이터로 채움
    if (!saved || JSON.parse(saved).length === 0) {
      const noticeList = [
        { type: "like",     message: "사용자 A님이 내 로드맵을 좋아합니다.",    date: "2분 전",  read: false },
        { type: "comment",  message: "사용자 B님이 내 로드맵에 댓글을 남겼습니다.", date: "10분 전", read: false },
        { type: "bookmark", message: "사용자 C님이 내 로드맵을 북마크했습니다.",   date: "1시간 전", read: false },
        { type: "like",     message: "사용자 D님이 내 로드맵을 좋아합니다.",    date: "어제",    read: false },
      ];
      setNotices(noticeList);
      localStorage.setItem("notices", JSON.stringify(noticeList));
    } else {
      // 저장된 알림이 있으면 그대로 사용
      setNotices(JSON.parse(saved));
    }
  }, []);

  // (2) notices가 바뀔 때마다 로컬스토리지에 자동 저장
  useEffect(() => {
    localStorage.setItem("notices", JSON.stringify(notices));
  }, [notices]);

  
  // 전체 읽음 처리
  const  readAllList=()=> {
    const next = notices.map(n => ({ ...n, read: true }));
    setNotices(next);
  }

  // 특정 인덱스 알림 읽음/안읽음 토글
  const toggleRead=(index) =>{
    const next = notices.map((n, i) => {
      if (i === index) {
        return { ...n, read: !n.read };
      }
      return n;
    });
    setNotices(next);
  }

  // 읽지 않은 알림 개수
  const unreadCount = notices.filter(n => !n.read).length;

  return (
    <>
 
      <TopHeader nickname={nickname} />

      <Container>
        <TopContainer>
          <Title>알림</Title>
          <MarkAllButton onClick={readAllList} disabled={unreadCount === 0}>모든 알림 읽기</MarkAllButton>
        </TopContainer>

        <NoticeList>
          {notices.length === 0 ? (<p>알림이 없습니다.</p>) : (
            notices.map((notice, idx) => {
              const iconElement = getIconByType(notice.type);
              const iconColor = getColorByType(notice.type);
              const isDim = notice.read;

              return (
                <NoticeContainer key={idx} $read={notice.read} onClick={() => toggleRead(idx)}>

                  <IconContainer $color={iconColor} $dim={isDim}>{iconElement}</IconContainer>

                  <NoticeText $read={notice.read}>{notice.message}</NoticeText>
                  <NoticeDate $read={notice.read}>{notice.date}</NoticeDate>
                </NoticeContainer>
              );
            })
          )}
        </NoticeList>
      </Container>
    </>
  );
}

export default NoticePage;
