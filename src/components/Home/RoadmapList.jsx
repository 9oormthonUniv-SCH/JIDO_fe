import React from "react";
import styled from "styled-components";

const PopularRoadmap = styled.h2`
  font-size:22px;
  font-weight:bold;
  color:#2e5c4d;
  margin-right:auto;
  margin-left:250px;
  margin-top:30px;
  margin-bottom:50px;
`;

const RoadmapContainer = styled.div`
  display:flex;
  flex-wrap:wrap;
  justify-content: center;
  gap:25px;
  margin-bottom: 80px; 
`;

const RoadmapCard = styled.div`
  width:260px;
  height:150px;
  background:#ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding:20px;
  cursor: pointer;
  &:hover {box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);}
`;

const CardHeader = styled.div`
  margin-bottom:70px;
`;

const RoadmapTitle = styled.h3`
  font-size:21px;
  font-weight:bold;
  margin:0;
  color:black;
`;

const RoadmapAuthor = styled.p`
  font-size:14px;
  color: #605d5dff;
  margin-top:5px;
`;

const CardBottom = styled.div`
  display:flex;
  gap:10px;
`;

const IconText = styled.span`
  font-size:13px;
  color: #2e5c4d;
  font-weight:bold;
`;


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
              <CardBottom>
                <IconText>좋아요 {roadmap.likes || 0}</IconText>
                <IconText>북마크 {roadmap.scraps || 0}</IconText>
              </CardBottom>
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
