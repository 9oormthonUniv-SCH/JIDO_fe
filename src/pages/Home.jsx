import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";
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
  const [filteredRoadmaps, setFilteredRoadmaps] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체 로드맵");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("nickname");
    if (stored) setNickname(stored);

    const savedRoadmaps = JSON.parse(localStorage.getItem("roadmaps")) || [];
    setRoadmaps(savedRoadmaps);
    setFilteredRoadmaps(savedRoadmaps);
  }, []);

  const filterRoadmaps = (category) => {
    if (category === "전체") {
      setFilteredRoadmaps(roadmaps);
      setSelectedCategory("전체 로드맵");
      return; 
    }
    const filtered = roadmaps.filter((roadmap) =>
      roadmap.category?.includes(category)
    );
    setFilteredRoadmaps(filtered);
    setSelectedCategory(category);
  };

  const handleCardClick = (idx) => {
    if (!nickname) {
      navigate("/login");
    } else {
      navigate(`/roadmap/${idx}`);
    }
  };

  return (
    <>
      <TopHeader nickname={nickname} />
      <HomeContainer>
        <WelcomeSection />
       <CategorySection categories={categories} selectedCategory={selectedCategory} filterRoadmaps={filterRoadmaps}/>
       <RoadmapList selectedCategory={selectedCategory} filteredRoadmaps={filteredRoadmaps} handleCardClick={handleCardClick}/>
      </HomeContainer>
    </>
  );
}

export default Home;
