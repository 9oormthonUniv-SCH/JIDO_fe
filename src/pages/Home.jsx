import { useEffect, useMemo, useState } from "react";import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate, useSearchParams  } from "react-router-dom";
import categories from "../data/categories";
import WelcomeSection from "../components/Home/WelcomeSection";
import CategorySection from "../components/Home/CategorySection";
import RoadmapList from "../components/Home/RoadmapList";

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
  const [params] = useSearchParams();

  // URL 쿼리로 들어온 검색어 (예: /?query=백엔드)
  const queryRaw = params.get("query") || "";
  const query = queryRaw.trim().toLowerCase();

  useEffect(() => {
    const stored = localStorage.getItem("nickname");
    if (stored) setNickname(stored);

    const savedRoadmaps = JSON.parse(localStorage.getItem("roadmaps") || "[]");
    setRoadmaps(savedRoadmaps);
  }, []);

  // 카테고리 버튼 클릭 시 선택만 바꿔주면 됨 (실제 필터링은 useMemo에서 수행)
  const filterRoadmaps = (category) => {
    if (category === "전체") {
      setSelectedCategory("전체 로드맵");
      return;
    }
    setSelectedCategory(category);
  };

  // 화면에 보여줄 목록 = 원본 roadmaps → 카테고리 필터 → 검색어 필터
  const visibleRoadmaps = useMemo(() => {
    let list = roadmaps;

    // 1) 카테고리 필터 (선택이 '전체 로드맵'이 아닐 때만)
    if (selectedCategory && selectedCategory !== "전체 로드맵") {
      list = list.filter((r) => (r.category || "").includes(selectedCategory));
    }

    // 2) 검색 필터 (제목 / 카테고리 / 작성자 닉네임)
    if (query) {
      list = list.filter((r) => {
        const haystack = [
          r.title || "",
          r.category || "",
          r.authorNickname || r.author || "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    return list;
  }, [roadmaps, selectedCategory, query]);

  // 카드 클릭: 필터된 배열의 idx → 원본 배열의 실제 idx 로 매핑 후 라우팅
  const handleCardClick = (idxInVisible) => {
    if (!nickname) {
      navigate("/login");
      return;
    }
    const picked = visibleRoadmaps[idxInVisible];
    const realIndex = roadmaps.findIndex((r) => r === picked);
    // 혹시 못 찾으면 안전하게 0으로
    navigate(`/roadmap/${realIndex >= 0 ? realIndex : 0}`);
  };

  // 상단 타이틀: 검색어가 있으면 "검색: ~", 없으면 선택 카테고리
  const heading =
    queryRaw.trim() ? `“${queryRaw.trim()}”검색 결과` : selectedCategory;

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