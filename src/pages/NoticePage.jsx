// NoticePage.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { FaHeart, FaComment, FaBookmark, FaBell } from "react-icons/fa";
import { fetchNotifications, markAllRead, markOneRead , deleteRead} from "../api/notification";

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

// createdAt 포맷 (간단 버전)
const toDateLabel = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch { return ""; }
};


/* =========================
   3) 메인 컴포넌트
   ========================= */
function NoticePage() {
  const [nickname, setNickname] = useState("");
  const [notices, setNotices] = useState([]);

  // 서버에서 목록 가져오기
  const load = async () => {
    try {
      const list = await fetchNotifications();      // GET /notifications
      console.log(list);
      // 서버 모델 -> 화면 모델로 살짝 포맷
      const mapped = (list || []).map(n => ({
        id: n.id ?? n.notificationId,        // 서버가 어떤 키를 주든 대응
        type: n.type ?? "bell",              // 없으면 기본
        message: n.message,
        date: toDateLabel(n.createdAt),
        read: !!n.isRead,
        url: n.url || null,
      }));
      setNotices(mapped);
      console.log("[MAPPED LIST]", mapped); 
      // 헤더 배지 갱신용(선택) — auth-change를 날리면 TopHeader 폴링 없이 즉시 반영 가능
      window.dispatchEvent(new Event("auth-change"));
    } catch (e) {
      console.error("[NOTICE] fetch error", e?.response || e);
      setNotices([]);
    }
  };

  useEffect(() => {
    // 닉네임(헤더용)
    setNickname(localStorage.getItem("nickname") || "");
    load();
  }, []);

  // 모두 읽음
  const handleMarkAll = async () => {
    try {
      await markAllRead();            // PUT /notifications/mark-all-read
       try { await deleteRead(); } catch (_) {} 
      await load();
      window.dispatchEvent(new Event("notice-updated"));
    } catch (e) {
      console.error("[NOTICE] mark-all", e?.response || e);
    }
  };

  // 개별 토글(읽지 않았다면 읽음 처리만 서버 호출)
  const toggleRead = async (idx) => {
    const item = notices[idx];
    if (!item) return;

    // 서버에서 id를 내려주지 않으면 개별 처리 불가 → 그냥 url로 이동만
     if (!item.id) {
   console.warn("[NOTICE] no id in item; cannot mark read individually. Check API payload.");
    if (item.url) window.location.href = item.url;
    return;
  }


    if (!item.read) {
      try {
        await markOneRead(item.id);   // PUT /notifications/{id}/read
        console.log(item.id);
      // ✅ 1) 리스트 즉시 회색(낙관적)
      setNotices(prev => prev.map((n, i) => i === idx ? { ...n, read: true } : n));
      // ✅ 2) 헤더 배지 즉시 -1
      window.dispatchEvent(new CustomEvent("notice-delta", { detail: { delta: -1 } }));
      // (선택) 안정성: 헤더가 최신을 못 받았을 때 대비해 재조회 트리거
      window.dispatchEvent(new Event("notice-updated"));

      // (선택) 알림에 링크가 있으면 이동
      if (item.url) window.location.href = item.url;
     
      } catch (e) {
        console.error("[NOTICE] mark-one", e?.response || e);
      }
    } else {
      // 서버에 “다시 안읽음” API가 없다면, UI만 토글하지 말고 그대로 두는 편이 안전
      // 필요하면 그냥 링크 이동만 처리
      if (item.url) window.location.href = item.url;
    }
  };

  const unreadCount = notices.filter(n => !n.read).length;


  return (
    <>
 
      <TopHeader nickname={nickname} />

      <Container>
        <TopContainer>
          <Title>알림</Title>
           <MarkAllButton onClick={handleMarkAll} disabled={unreadCount === 0}>모든 알림 읽기</MarkAllButton>
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
