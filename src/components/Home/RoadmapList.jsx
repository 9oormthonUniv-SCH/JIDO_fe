import React from "react";
import styled from "styled-components";

// 스타일 정의 시작
const PopularRoadmap = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #2e5c4d;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 50px;
`;

const RoadmapContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
    margin-bottom: 80px; 
`;

const RoadmapCard = styled.div`
  width: 260px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  margin-bottom: 10px;
`;

const RoadmapTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333;
`;

const RoadmapAuthor = styled.p`
  font-size: 14px;
  color: #888;
  margin-top: 5px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const IconText = styled.span`
  font-size: 14px;
  color: #555;
`;
// 스타일 정의 끝

function RoadmapList({ selectedCategory, filteredRoadmaps, handleCardClick }) {
  return (
    <>
      <PopularRoadmap>{selectedCategory}</PopularRoadmap>
      <RoadmapContainer>
        {filteredRoadmaps.length > 0 ? (
          filteredRoadmaps.map((roadmap, idx) => (
            <RoadmapCard key={idx} onClick={() => handleCardClick(idx)}>
              <CardHeader>
                <RoadmapTitle>{roadmap.title}</RoadmapTitle>
                <RoadmapAuthor>by. {roadmap.author}</RoadmapAuthor>
              </CardHeader>
              <CardFooter>
                <IconText>❤️ {roadmap.likes || 0}</IconText>
                <IconText>📌 {roadmap.scraps || 0}</IconText>
              </CardFooter>
            </RoadmapCard>
          ))
        ) : (
          <p style={{ margin: "0 auto", color: "#666" }}>
            해당 카테고리에 로드맵이 없습니다.
          </p>
        )}
      </RoadmapContainer>
    </>
  );
}

export default RoadmapList;
