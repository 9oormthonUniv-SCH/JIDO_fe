// src/pages/MyPage.jsx
import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
import { listRoadmaps } from "../api/roadmap";
import { listMyBookmarks } from "../api/roadmapLike"; // ★ 추가


const Container = styled.div`
  --brand: #2e5c4d;
  --ink: #0f172a;
  --muted: #6b7280;
  --card: #ffffff;

  display: flex;
  flex-direction: column;

  /* 가운데 정렬 + 좌우 여백 */
  max-width: 1120px;
  margin: 96px auto 80px;
  padding: 30px 24px;
`;

const MyFavorite = styled.div`
  /* 한 줄에 카드가 꽉 차게 들어가도록 반응형 그리드 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const MyRoadmap = styled(MyFavorite)``;

const Label = styled.p`
  font-size: 22px;
  font-weight: 800;
  color: var(--ink);
  margin: 8px 0 16px;
  letter-spacing: -0.2px;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  /* 라벨 왼쪽에 포인트 바 */
  &::before {
    content: "";
    width: 6px;
    height: 18px;
    border-radius: 3px;
    background: var(--brand);
    display: inline-block;
  }
`;

const RoadmapCard = styled.div`
  position: relative;
  background: var(--card);
  border-radius: 16px;
  padding: 18px 18px 16px;
  cursor: pointer;

  /* 고급스러운 보더/그라데이션 효과 */
  border: 1px solid rgba(46, 92, 77, 0.14);
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(46, 92, 77, 0.08);

  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(46, 92, 77, 0.28);
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.06),
      0 16px 40px rgba(46, 92, 77, 0.14);
  }

  /* 카드 안의 영역 배치 */
  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap: 12px;

  min-height: 168px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: #101828;
  margin: 0 0 4px 0;
  line-height: 1.25;

  /* 두 줄까지만 보이도록 깔끔하게 자르기 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: var(--muted);
  margin: 0;

  /* 설명도 최대 두 줄 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* 살짝 배경 느낌 */
  background: linear-gradient(180deg, #f9fbfa 0%, #ffffff 100%);
  border-radius: 10px;
  padding: 8px 10px;
  border: 1px solid rgba(46, 92, 77, 0.06);
`;

const CardAuthor = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #475467;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "by";
    font-weight: 700;
    color: var(--brand);
    letter-spacing: 0.2px;
  }
`;
function MyPage() {
  const [nickname, setNickname] = useState("");
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [bookmarkedRoadmaps, setBookmarkedRoadmaps] = useState([]); // ★ 추가
  const navigate = useNavigate();

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedUserId = localStorage.getItem("userId");
    if (storedNickname) setNickname(storedNickname);

    (async () => {
      try {
        // 1) 전체 로드맵
        const all = await listRoadmaps(); // GET /roadmaps

        // 2) 내가 작성한 로드맵
        const mine = all.filter(r => String(r.authorId) === String(storedUserId));
        setMyRoadmaps(mine);

        // 3) 내가 북마크한 로드맵 ID 목록
        const myBm = await listMyBookmarks(); // [{ roadmapId, bookmarkedAt }]
        const bmIdSet = new Set(myBm.map(x => Number(x.roadmapId)));

        // 4) 전체 로드맵 중, 북마크 ID에 해당하는 것만 추출
        const bookmarked = all.filter(r => bmIdSet.has(Number(r.roadmapId)));

        // (선택) 북마크한 시간으로 정렬하고 싶으면 다음 주석 해제
        // const bookmarked = all
        //   .filter(r => bmIdSet.has(Number(r.roadmapId)))
        //   .sort((a, b) => {
        //     const aAt = myBm.find(x => x.roadmapId === a.roadmapId)?.bookmarkedAt ?? 0;
        //     const bAt = myBm.find(x => x.roadmapId === b.roadmapId)?.bookmarkedAt ?? 0;
        //     return new Date(bAt) - new Date(aAt);
        //   });

        setBookmarkedRoadmaps(bookmarked);
      } catch (err) {
        console.error("마이페이지 데이터 로드 실패:", err);
        setMyRoadmaps([]);
        setBookmarkedRoadmaps([]);
      }
    })();
  }, []);

  const handleNavigate = (roadmapId) => {
    navigate(`/roadmaps/${roadmapId}`);
  };

  return (
    <>
      <TopHeader nickname={nickname} />
      <Container>
        {/* 내가 작성한 로드맵 */}
        <Label>나의 로드맵</Label>
        <MyRoadmap>
          {myRoadmaps.length > 0 ? (
            myRoadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.roadmapId} onClick={() => handleNavigate(roadmap.roadmapId)}>
                <CardTitle>{roadmap.title}</CardTitle>
                <CardDescription>
                  {roadmap.description?.length > 40
                    ? roadmap.description.slice(0, 40) + "..."
                    : roadmap.description}
                </CardDescription>
                <CardAuthor>작성자 : {roadmap.authorNickname}</CardAuthor>
              </RoadmapCard>
            ))
          ) : (
            <p>작성한 로드맵이 없습니다.</p>
          )}
        </MyRoadmap>

        {/* 내가 북마크한 로드맵 */}
        <Label style={{ marginTop: 24 }}>북마크한 로드맵</Label>
        <MyFavorite>
          {bookmarkedRoadmaps.length > 0 ? (
            bookmarkedRoadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.roadmapId} onClick={() => handleNavigate(roadmap.roadmapId)}>
                <CardTitle>{roadmap.title}</CardTitle>
                <CardDescription>
                  {roadmap.description?.length > 40
                    ? roadmap.description.slice(0, 40) + "..."
                    : roadmap.description}
                </CardDescription>
                <CardAuthor>작성자 : {roadmap.authorNickname}</CardAuthor>
              </RoadmapCard>
            ))
          ) : (
            <p>북마크한 로드맵이 없습니다.</p>
          )}
        </MyFavorite>
      </Container>
    </>
  );
}

export default MyPage;
