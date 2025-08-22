// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate, useSearchParams } from "react-router-dom";
import categories from "../data/categories";
import WelcomeSection from "../components/Home/WelcomeSection";
import CategorySection from "../components/Home/CategorySection";
import RoadmapList from "../components/Home/RoadmapList";
import { listRoadmaps , getRoadmap} from "../api/roadmap";
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

  // ✅ query 파라미터 읽기 + 바꾸기(setSearchParams) 둘 다 사용
  const [params, setSearchParams] = useSearchParams();
  const queryRaw = params.get("query") || "";
  const query = queryRaw.trim().toLowerCase();

  // 초기 데이터 로드
  useEffect(() => {
    const cachedName = localStorage.getItem("nickname");
    if (cachedName) setNickname(cachedName);

    
  }, []);

   // 2) 검색어에 따라 서버 호출 (검색 있으면 searchAll, 없으면 listRoadmaps)
  useEffect(() => {
    (async () => {
      try {
        if (query) {
          // 🔎 백엔드 검색 호출
          const data = await searchAll(query); // { users: [...], roadmaps: [...] }
          console.log(data);
          setRoadmaps(data?.roadmaps ?? []);
        } else {
          
          //여기서 전체로드맵요청하고 서버응답을 상태에 저장 
          const data = await listRoadmaps();
          setRoadmaps(data);
          console.log(data);
        }
      } catch (err) {
        console.error("로드맵/검색 불러오기 실패:", err);
        setRoadmaps([]);
      }
    })();
  }, [query]);

  // 카테고리 클릭 시: 검색모드 종료(쿼리 제거) + 선택 카테고리 변경
  const filterRoadmaps = (category) => {
    setSearchParams({}); // 🔴 URL에서 ?query= 제거 → 검색모드 종료
    if (category === "전체") {
      setSelectedCategory("전체 로드맵");
      return;
    }
    setSelectedCategory(category);
  };

  // 화면에 보여줄 목록 = 원본 roadmaps → 카테고리 필터 → 검색어 필터
  const visibleRoadmaps = useMemo(() => {
    let list = roadmaps;

    // 1) 카테고리 필터
    if (selectedCategory && selectedCategory !== "전체 로드맵") {
      list = list.filter((r) => (r.category || "").includes(selectedCategory));
    }

    // 2) 검색어 필터 (제목/카테고리/작성자)
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

  // 카드 클릭 → 상세로 이동
  const handleCardClick = (roadmapId) => {
    navigate(`/roadmaps/${roadmapId}`);
  };

  // 상단 타이틀
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
