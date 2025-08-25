// src/components/TopHeader.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { FaBell } from "react-icons/fa";
import { getUserById } from "../api/users";   // 파일명이 user.js면 경로 맞춰주세요
import { fetchUnread } from "../api/notification"; // ✅ 종 아이콘에 쓸 미읽음 알림 API

/* --- styled components --- */
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 12px;
  border-bottom: 1px solid #a6aea9ff;
  background-color: #fafdfb;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Option = styled.button`
  font-size: 15px;
  color: black;
  cursor: pointer;
  font-weight: bold;
  background: none;
  border: none;
  padding: 0;
  &:hover { font-size: 17px; }
`;

const SearchForm = styled.form`
  margin-left: 20px;
`;

const SearchInput = styled.input`
  border-radius: 20px;
  background: white;
  width: 300px;
  height: 30px;
  font-size: 12px;
  border: 1px solid black;
  padding: 0 12px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 30px;
`;

const NicknameBtn = styled.button`
  font-size: 15px;
  font-weight: bold;
  border: none;
  background: none;
  cursor: pointer;
`;

/* ✅ 종 아이콘 & 배지 */
const NoticeBell = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
`;

const NoticeNum = styled.span`
  position: absolute;
  top: -4px;
  right: -2px;
  background: red;
  color: white;
  border-radius: 9999px;
  font-size: 10px;
  line-height: 1;
  padding: 2px 6px;
`;

const LoginButton = styled.button`
  color: white;
  font-size: 12px;
  cursor: pointer;
  background: #2e5c4d;
  border: none;
  border-radius: 30px;
  height: 40px;
  width: 80px;
  &:hover { font-weight: bold; background: #24493d; }
`;

/* --- component --- */
function TopHeader({ nickname: nicknameProp, onLogoClick }) {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);
  const [nickname, setNickname] = useState("");
  const [q, setQ] = useState("");
  const [noticeCount, setNoticeCount] = useState(0); // ✅ 미읽음 개수
  // 🔹 로그인 상태/닉네임 동기화
  useEffect(() => {
    const sync = async () => {
      const uid = localStorage.getItem("userId");
      const savedNick = localStorage.getItem("nickname") || "";
      setIsAuthed(!!uid);
      if (savedNick) setNickname(savedNick);

      // 저장된 닉이 없으면 서버에서 1회 조회해서 캐시
      if (uid && !savedNick) {
        try {
          const me = await getUserById(uid);  // 쿠키 기반 인증으로 동작
          const nn = me?.nickName;
          if (nn) {
            setNickname(nn);
            localStorage.setItem("nickname", nn);
          }
        } catch {/* 무시 */}
      }
    };
    sync();
    // 로그인/로그아웃 시 즉시 갱신
    window.addEventListener("auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // ✅ 미읽음 알림 개수 폴링 (30초 간격)
  useEffect(() => {
    let timer;
    const loadUnread = async () => {
      if (!isAuthed) { setNoticeCount(0); return; }
      try {
        const unread = await fetchUnread(); // 배열 또는 숫자라면 프로젝트에 맞게 조정
        const count = Array.isArray(unread) ? unread.length : Number(unread) || 0;
        setNoticeCount(count);
      } catch (e) {
        setNoticeCount(0);
      }
    };
    loadUnread();
    timer = setInterval(loadUnread, 30000);
    return () => clearInterval(timer);
  }, [isAuthed]);

  const goOrAskLogin = (path) => {
    if (!isAuthed) {
      alert("로그인이 필요합니다!");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    const keyword = q.trim();
    if (!keyword) return;
    navigate(`/?query=${encodeURIComponent(keyword)}`);
  };

  return (
    <HeaderContainer>
      <Menu>
        <Logo onClick={() => {
   if (onLogoClick) onLogoClick();
   else navigate("/");
 }} />
        <Option onClick={() => navigate("/")}>로드맵 목록</Option>
        <Option onClick={() => goOrAskLogin("/mypage")}>나의 로드맵</Option>
        <Option onClick={() => goOrAskLogin("/newfeed")}>로드맵 만들기</Option>

        <SearchForm onSubmit={onSubmitSearch}>
          <SearchInput
            placeholder="🔍 검색어를 입력하세요"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </SearchForm>
      </Menu>

      <Right>
        {isAuthed ? (
          <>
            <NicknameBtn onClick={() => navigate("/myinfo")}>
              {nickname} 님 환영합니다
            </NicknameBtn>

            <NoticeBell onClick={() => goOrAskLogin("/NoticePage")} aria-label="알림">
              <FaBell size={18} />
              {noticeCount > 0 && <NoticeNum>{noticeCount}</NoticeNum>}
            </NoticeBell>
          </>
        ) : (
          <LoginButton onClick={() => navigate("/login")}>로그인</LoginButton>
        )}
      </Right>
    </HeaderContainer>
  );
}

export default TopHeader;
