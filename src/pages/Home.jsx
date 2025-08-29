// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import categories from "../data/categories";
import WelcomeSection from "../components/Home/WelcomeSection";
import CategorySection from "../components/Home/CategorySection";
import RoadmapList from "../components/Home/RoadmapList";
import { listRoadmaps } from "../api/roadmap";
import { searchAll } from "../api/search";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafdfb;
  margin-top: 120px;
`;

function Home() {
  const [nickname, setNickname] = useState("");
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체 로드맵");

  const navigate = useNavigate();
  const location = useLocation();

  const [params, setSearchParams] = useSearchParams();
  const queryRaw = params.get("query") || "";
  const query = queryRaw.trim().toLowerCase();

  useEffect(() => {
    const cachedName = localStorage.getItem("nickname");
    if (cachedName) setNickname(cachedName);
  }, []);

  // ✅ fetch: 디테일에서 state를 들고 온 프레임은 건너뛰기(레이스 방지)
  useEffect(() => {
    if (location.state?.updatedId) {
      console.log("[HOME] skip fetch: pending merge from detail");
      return;
    }
    (async () => {
      try {
        if (query) {
          const data = await searchAll(query);
          console.log("[HOME] fetched by searchAll", data?.roadmaps?.length, data?.roadmaps?.slice(0,5));
          setRoadmaps(data?.roadmaps ?? []);
        } else {
          const data = await listRoadmaps();
          console.log("[HOME] fetched by listRoadmaps", data?.length, data?.slice(0,5));
          setRoadmaps(data ?? []);
        }
      } catch (err) {
        console.error("[HOME] fetch error", err);
        setRoadmaps([]);
      }
    })();
  }, [query, location.state]); // ← 가드가 state를 보고 있으니 deps에 포함

  // ✅ 병합: 디테일에서 넘어온 최신 like/bookmark를 해당 카드에만 반영
  useEffect(() => {
    const s = location.state;
    if (s?.updatedId) {
      const { updatedId, likeCount, bookmarkCount } = s;
      console.log("[HOME] merge counts from state", { updatedId, likeCount, bookmarkCount });

      setRoadmaps(prev =>
        prev.map(r =>
          Number(r.roadmapId) === Number(updatedId) // 타입 맞춰 비교
            ? {
                ...r,
                likeCount: likeCount ?? r.likeCount,
                bookmarkCount: bookmarkCount ?? r.bookmarkCount,
              }
            : r
        )
      );

      // 중복 실행/뒤로가기 잔상 방지
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate, location.pathname]);

  const filterRoadmaps = (category) => {
    setSearchParams({}); // 검색모드 종료
    setSelectedCategory(category === "전체" ? "전체 로드맵" : category);
  };

  const visibleRoadmaps = useMemo(() => {
    let list = roadmaps;
    if (selectedCategory && selectedCategory !== "전체 로드맵") {
      list = list.filter(r => (r.category || "").includes(selectedCategory));
    }
    if (query) {
      list = list.filter(r => {
        const haystack = [r.title||"", r.category||"", r.authorNickname||r.author||""]
          .join(" ").toLowerCase();
        return haystack.includes(query);
      });
    }
    return list;
  }, [roadmaps, selectedCategory, query]);

  const handleCardClick = (roadmapId) => navigate(`/roadmaps/${roadmapId}`);
  const heading = queryRaw.trim() ? `“${queryRaw.trim()}” 검색 결과` : selectedCategory;

  return (
    <>
      <TopHeader nickname={nickname} />
      <HomeContainer>
        <WelcomeSection />
        <CategorySection
          categories={categories}
          selectedCategory={selectedCategory}
          filterRoadmaps={filterRoadmaps}
        />
        <RoadmapList
          selectedCategory={heading}
          filteredRoadmaps={visibleRoadmaps}
          handleCardClick={handleCardClick}
        />
      </HomeContainer>
    </>
  );
}

export default Home;
