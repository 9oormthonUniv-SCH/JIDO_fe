import React, { useEffect, useState, useCallback, useRef  } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import Logo from "../components/Logo";
import { useLocation } from "react-router-dom";
import { fetchUnread } from "../api/notification";
import {searchAll} from "../api/search";

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
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Option = styled.p`
  font-size: 15px;
  color: black;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    font-size: 17px;
  }
`;

const SearchInput = styled.input`
  border-radius: 20px;
  background: white;
  width: 500px;
  height: 30px;
  font-size: 12px;
  border: 1px solid black;
  padding-left: 12px;
  &:focus::placeholder {
    color: transparent;
  }
`;
const SearchWrap = styled.div`
  position: relative; /* 드롭다운 위치 기준 */
`;

const ResultBox = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  width: 500px;
  background: #fff;
  border: 1px solid #c3d4ce;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  z-index: 20;
  max-height: 360px;
  overflow-y: auto;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 12px;
  color: #2e5c4d;
  padding: 8px 10px 4px;
  border-top: 1px solid #eef2f0;
  &:first-child { border-top: none; }
`;

const Item = styled.button`
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  &:hover { background: #f6faf8; }
`;

const LoginMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 30px;
`;

const UserNickname = styled.button`
  font-size: 15px;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
  display: flex;
  margin-left: 30px;
`;

const WelcomeText = styled.p`
  font-size: 15px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LoginButton = styled.button`
  color: white;
  font-size: 12px;
  cursor: pointer;
  background: #2e5c4d;
  border: none;
  border-radius: 30px;
  height: 45px;
  width: 80px;
  &:hover {
    font-weight: bold;
    background: #24493d;
  }
`;

const NoticeBell = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
`;

const NoticeNum = styled.span`
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -2px;
  background: red;
  color: white;
  font-size: 7px;
  padding: 2px 5px;
`;

function TopHeader({ nickname }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 상태 읽기
  const readAuth  = useCallback(() => localStorage.getItem("auth") === "true", []);
  const readName  = useCallback(() => localStorage.getItem("nickname") || nickname || "", [nickname]);

  const [isAuthed, setIsAuthed] = useState(() => readAuth());
  const [displayName, setDisplayName] = useState(() => readName());
  const [noticeCount, setNoticeCount] = useState(0);

  // 검색 상태
  const [q, setQ] = useState("");
  const [results, setResults] = useState({ users: [], roadmaps: [] });
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const timerRef = useRef(null);

  /* --- 검색 --- */
  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!q.trim()) {
      setResults({ users: [], roadmaps: [] });
      return;
    }
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchAll(q.trim());
        setResults({ users: data?.users ?? [], roadmaps: data?.roadmaps ?? [] });
        setOpen(true);
      } catch {
        setResults({ users: [], roadmaps: [] });
        setOpen(false);
      }
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [q]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  /* --- 로그인 상태/닉네임 감지 --- */
  useEffect(() => {
    const handler = () => {
      setIsAuthed(readAuth());
      setDisplayName(readName());
    };
    window.addEventListener("auth-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("auth-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [readAuth, readName]);

  useEffect(() => {
    setIsAuthed(readAuth());
    setDisplayName(readName());
  }, [location.pathname, readAuth, readName]);

  /* --- 알림 개수 --- */
  useEffect(() => {
    let timer;
    const load = async () => {
      if (!readAuth()) { setNoticeCount(0); return; }
      try {
        const unread = await fetchUnread();
        setNoticeCount(Array.isArray(unread) ? unread.length : 0);
      } catch { setNoticeCount(0); }
    };
    load();
    timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, [location.pathname]);

  /* --- 공통 함수 --- */
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
    if (!q.trim()) return;
    navigate(`/?query=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  /* --- JSX --- */
  return (
    <HeaderContainer>
      <Menu>
        <Logo onClick={() => navigate("/")} />
        <Option onClick={() => navigate("/")}>로드맵 목록</Option>
        <Option onClick={() => goOrAskLogin("/mypage")}>나의 로드맵</Option>
        <Option onClick={() => goOrAskLogin("/newfeed")}>로드맵 만들기</Option>

        {/* 검색 */}
        <SearchWrap ref={boxRef}>
          <form onSubmit={onSubmitSearch}>
            <SearchInput
              placeholder="🔍 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => {
                if (results.users?.length || results.roadmaps?.length) setOpen(true);
              }}
            />
          </form>

          {open && (results.users?.length || results.roadmaps?.length) ? (
            <ResultBox>
              {results.users?.length > 0 && (
                <>
                  <SectionTitle>사용자</SectionTitle>
                  {results.users.map((u) => (
                    <Item key={`u-${u.userId}`}
                      onClick={() => { navigate(`/user/${u.userId}`); setOpen(false); }}>
                      {u.nickname} (ID: {u.userId})
                    </Item>
                  ))}
                </>
              )}
              {results.roadmaps?.length > 0 && (
                <>
                  <SectionTitle>로드맵</SectionTitle>
                  {results.roadmaps.map((r) => (
                    <Item key={`r-${r.roadmapId}`}
                      onClick={() => { navigate(`/roadmap/${r.roadmapId}`); setOpen(false); }}>
                      {r.title}
                    </Item>
                  ))}
                </>
              )}
            </ResultBox>
          ) : null}
        </SearchWrap>
      </Menu>

      <LoginMenu>
        {isAuthed ? (
          <WelcomeText>
            <UserNickname onClick={() => navigate("/myinfo")}>
              {displayName}
            </UserNickname>
            님 환영합니다!
            <NoticeBell onClick={() => goOrAskLogin("/noticepage")}>
              <FaBell size={18} />
              {noticeCount > 0 && <NoticeNum>{noticeCount}</NoticeNum>}
            </NoticeBell>
          </WelcomeText>
        ) : (
          <LoginButton onClick={() => navigate("/login")}>로그인</LoginButton>
        )}
      </LoginMenu>
    </HeaderContainer>
  );
}

export default TopHeader;