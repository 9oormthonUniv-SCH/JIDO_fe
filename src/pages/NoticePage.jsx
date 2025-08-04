import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { FaHeart, FaComment, FaBookmark } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120px;
  padding: 20px;
  background: #fafdfb;
  min-height: 100vh;
`;

const NoticeList = styled.div`
  width: 800px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NoticeItem = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #c3d4ce;
  border-radius: 12px;
  padding: 12px 16px;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const IconWrapper = styled.div`
  font-size: 20px;
  color: ${(props) =>
    props.type === "like" ? "#e74c3c" :
    props.type === "comment" ? "#3498db" :
    props.type === "bookmark" ? "#2ecc71" : "#555"};
`;

const NoticeText = styled.div`
  flex: 1;
  font-size: 15px;
  color: #333;
`;

const NoticeDate = styled.div`
  font-size: 12px;
  color: #888;
`;

function NoticePage() {
  const [nickname, setNickname] = useState("");
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) setNickname(storedNickname);

    // 더미 데이터 (백엔드 연동 전)
    const dummyNotices = [
      { type: "like", message: "사용자 A님이 내 로드맵을 좋아합니다.", date: "2분 전" },
      { type: "comment", message: "사용자 B님이 내 로드맵에 댓글을 남겼습니다.", date: "10분 전" },
      { type: "bookmark", message: "사용자 C님이 내 로드맵을 북마크했습니다.", date: "1시간 전" },
      { type: "like", message: "사용자 D님이 내 로드맵을 좋아합니다.", date: "어제" },
    ];
    setNotices(dummyNotices);
  }, []);

  const renderIcon = (type) => {
    if (type === "like") return <FaHeart />;
    if (type === "comment") return <FaComment />;
    if (type === "bookmark") return <FaBookmark />;
    return null;
  };

  return (
    <>
    <TopHeader nickname={nickname} />
    <Container>
      
      <h2>알림</h2>
      <NoticeList>
        {notices.length === 0 ? (
          <p>알림이 없습니다.</p>
        ) : (
          notices.map((notice, idx) => (
            <NoticeItem key={idx}>
              <IconWrapper type={notice.type}>
                {renderIcon(notice.type)}
              </IconWrapper>
              <NoticeText>{notice.message}</NoticeText>
              <NoticeDate>{notice.date}</NoticeDate>
            </NoticeItem>
          ))
        )}
      </NoticeList>
    </Container>
    </>
  );
}

export default NoticePage;
