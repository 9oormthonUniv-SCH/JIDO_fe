import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import categories from "../data/categories"; // 로컬 더미 카테고리 (UI용)
import WelcomeSection from "../components/Home/WelcomeSection";
import CategorySection from "../components/Home/CategorySection";
import RoadmapList from "../components/Home/RoadmapList";
import { listRoadmaps } from "../api/roadmap";
import { searchAll } from "../api/search";
import { fetchCategories } from "../api/users";   // 서버 카테고리 불러오기

// ✅ 카테고리 매핑 함수
const buildCategoryMap = (cats) => {
  const map = {};
  const build = (depth, path, parentId) => {
    cats
      .filter((c) => c.depth === depth && c.parentCategoryId === parentId)
      .forEach((c) => {
        const newPath = path ? `${path} > ${c.name}` : c.name;
        console.log("[MAP]", newPath, "=", c.categoryId); // 디버그 로그
        map[newPath] = c.categoryId;
        build(depth + 1, newPath, c.categoryId);
      });
  };
  build(1, "", null);
  return map;
};

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
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryMap, setCategoryMap] = useState({}); // ✅ 서버 카테고리 매핑

  const navigate = useNavigate();
  const location = useLocation();
  const [params, setSearchParams] = useSearchParams();
  const queryRaw = params.get("query") || "";
  const query = queryRaw.trim().toLowerCase();

  // ✅ 닉네임 캐시 불러오기
  useEffect(() => {
    const cachedName = localStorage.getItem("nickname");
    if (cachedName) setNickname(cachedName);
  }, []);

  // ✅ 서버에서 카테고리 목록 가져와 매핑 생성
  useEffect(() => {
    (async () => {
      try {
        const cats = await fetchCategories();
        const map = buildCategoryMap(cats);
        setCategoryMap(map);
      } catch (err) {
        console.error("[HOME] 카테고리 불러오기 실패", err);
      }
    })();
  }, []);

  // ✅ 로드맵 불러오기 (검색 or 전체)
  useEffect(() => {
    if (location.state?.updatedId) {
      console.log("[HOME] skip fetch: pending merge from detail");
      return;
    }
    (async () => {
      try {
        if (query) {
          const data = await searchAll(query);
          setRoadmaps(data?.roadmaps?.filter((r) => r.isPublic) ?? []);
        } else {
          const data = await listRoadmaps();
          setRoadmaps(data?.filter((r) => r.isPublic) ?? []);
        }
      } catch (err) {
        console.error("[HOME] fetch error", err);
        setRoadmaps([]);
      }
    })();
  }, [query, location.state]);

  // ✅ 상세페이지에서 좋아요/북마크 값 merge
  useEffect(() => {
    const s = location.state;
    if (s?.updatedId) {
      const { updatedId, likeCount, bookmarkCount } = s;

      setRoadmaps((prev) =>
        prev.map((r) =>
          Number(r.roadmapId) === Number(updatedId)
            ? {
                ...r,
                likeCount: likeCount ?? r.likeCount,
                bookmarkCount: bookmarkCount ?? r.bookmarkCount,
              }
            : r
        )
      );
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate, location.pathname]);

  // ✅ 카테고리 선택 시
  const filterRoadmaps = async (categoryId) => {
      console.log("[FILTER] 전달된 categoryId:", categoryId); // ✅ 추가

    setSearchParams({});
    if (!categoryId) {
      setSelectedCategory("전체 로드맵");
      setSelectedCategoryId(null);
      const data = await listRoadmaps();
      setRoadmaps(data.filter((r) => r.isPublic));
    } else {
      setSelectedCategoryId(categoryId);

      // categoryId → 사람이 읽을 수 있는 이름으로 변환
      const displayName =
        Object.keys(categoryMap).find((k) => categoryMap[k] === categoryId) ||
        categoryId;

      setSelectedCategory(displayName);
      const data = await listRoadmaps(categoryId);
      setRoadmaps(data.filter((r) => r.isPublic));
    }
  };

  // ✅ 검색어/카테고리 필터링
  const visibleRoadmaps = useMemo(() => {
    let list = roadmaps;
    if (query) {
      list = list.filter((r) => {
        const haystack = [
          r.title || "",
          r.category || "",
          r.authorNickname || r.author || "",
        ].join(" ").toLowerCase();
        return haystack.includes(query);
      });
    }
    return list;
  }, [roadmaps, query]);

  const handleCardClick = (roadmapId) => navigate(`/roadmaps/${roadmapId}`);
  const heading = queryRaw.trim()
    ? `“${queryRaw.trim()}” 검색 결과`
    : selectedCategory;

  return (
    <>
      <TopHeader nickname={nickname} />
      <HomeContainer>
        <WelcomeSection />
        <CategorySection
          categories={categories} // UI용 로컬 데이터
          selectedCategory={selectedCategory}
          filterRoadmaps={filterRoadmaps}
          categoryMap={categoryMap} // ✅ 서버 매핑 전달
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
