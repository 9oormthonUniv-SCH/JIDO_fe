import { useEffect } from "react";
import styled from "styled-components";

// 타이틀 스타일
const PopularRoadmap = styled.h2`
  width: 100%;
  max-width: 1200px;
  margin: 42px auto 16px;
  font-size: 24px;
  font-weight: 700;
  color: #333;
  letter-spacing: 0.5px;
  text-align: center;
  line-height: 1.4;
`;

// 전체 컨테이너 스타일
const RoadmapContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 96px;
  padding: 0 24px;
  
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

// 카드 스타일
const RoadmapCard = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 160ms ease, box-shadow 160ms ease;

  cursor: pointer;

  /* hover 효과 */
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

// 카드 타이틀 스타일
const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 96px;
`;

const RoadmapTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// 작성자 이름 스타일
const RoadmapAuthor = styled.p`
  margin: 0;
  color: #777;
  font-size: 14px;
  font-weight: 600;
  padding-left: 14px;
`;

// 하단 버튼 스타일
const CardBottom = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: auto;
  flex-wrap: wrap;
`;

// 아이콘 텍스트 스타일
const IconText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f4f6f4;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

// 검색 결과나 카테고리 선택된 로드맵 타이틀
function RoadmapList({ selectedCategory, filteredRoadmaps, handleCardClick }) {
  useEffect(() => {
    console.groupCollapsed("[LIST] render filteredRoadmaps");
    console.table((filteredRoadmaps ?? []).map(r => ({
      id: r.roadmapId,
      title: r.title,
      like: r.likeCount,
      bm: r.bookmarkCount,
    })));
    console.groupEnd();
  }, [filteredRoadmaps]);

  return (
    <>
      <PopularRoadmap>{selectedCategory}</PopularRoadmap>
      <RoadmapContainer>
        {filteredRoadmaps.length > 0 ? (
          filteredRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.roadmapId}
              onClick={() => handleCardClick(roadmap.roadmapId)}
            >
              <CardHeader>
                <RoadmapTitle>{roadmap.title}</RoadmapTitle>
                <RoadmapAuthor>by {roadmap.authorNickname}</RoadmapAuthor>
              </CardHeader>
              <CardBottom>
                <IconText>좋아요 {roadmap.likeCount ?? 0}</IconText>
                <IconText>북마크 {roadmap.bookmarkCount ?? 0}</IconText>
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
