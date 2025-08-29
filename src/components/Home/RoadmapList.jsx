import React, { useEffect } from "react";
import styled from "styled-components";


const PopularRoadmap = styled.h2`
  /* 섹션 타이틀 */
  width: 100%;
  max-width: 1200px;
  margin: 42px auto 16px;
  padding: 0 24px;

  font-size: 28px;
  font-weight: 800;
  color: #1e2d2a;
  letter-spacing: 0.2px;

  position: relative;
  line-height: 1.2;

  /* 포인트 언더라인 */
  &::after {
    content: "";
    display: block;
    width: 76px;
    height: 6px;
    margin-top: 10px;
    border-radius: 6px;
    background: linear-gradient(90deg, #2e5c4d 0%, #66a992 55%, #9ad5c0 100%);
    box-shadow: 0 6px 14px rgba(46, 92, 77, 0.25);
  }
`;

const RoadmapContainer = styled.div`
  /* 가운데 정렬 + 반응형 그리드 */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 96px;
  padding: 0 24px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;

  /* iOS/Safari 렌더 보정 */
  align-items: stretch;
  justify-items: stretch;
`;

const RoadmapCard = styled.div`
  position: relative;
  overflow: hidden;

  /* 카드 베이스 */
  background:
    linear-gradient(#ffffff, #ffffff) padding-box,
    linear-gradient(180deg, #e8f1ed, #cfe3db) border-box;
  border: 1px solid transparent;
  border-radius: 16px;

  min-height: 190px;
  padding: 18px 18px 16px;

  /* 그림자/인터랙션 */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
  cursor: pointer;

  /* 은은한 상단 그라데이션 + 라이트 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(60% 30% at 50% 0%, rgba(154, 213, 192, 0.18), transparent 60%)
      ,radial-gradient(50% 20% at 0% 0%, rgba(106, 168, 147, 0.12), transparent 60%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
    border-color: #9ad5c0;
  }

  &:focus-visible {
    outline: 3px solid #2e5c4d;
    outline-offset: 3px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 96px; /* 타이틀 2줄 + 작성자 공간 확보 */
`;

const RoadmapTitle = styled.h3`
  margin: 0;
  color: #0f1413;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.25;

  /* 2줄 말줄임 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RoadmapAuthor = styled.p`
  margin: 0;
  color: #6a6f6d;
  font-size: 13px;
  font-weight: 600;
  padding-left: 14px;
  position: relative;

  /* 작은 포인트 도트 */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #9ad5c0;
  }
`;

const CardBottom = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: auto;
  flex-wrap: wrap;
`;

const IconText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 6px 10px;
  border-radius: 999px;
  background: #eef5f2;
  border: 1px solid #cfe3db;

  font-size: 12px;
  font-weight: 800;
  color: #2e5c4d;

  /* 작은 도트 */
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #66a992;
  }
`;

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
          filteredRoadmaps.map((roadmap, idx) => (
            <RoadmapCard
              key={roadmap.roadmapId}
              onClick={() => {
                console.log("[LIST] click card -> detail", roadmap.roadmapId);
                handleCardClick(roadmap.roadmapId);
              }}
            >
              <CardHeader>
                <RoadmapTitle>{roadmap.title}</RoadmapTitle>
                <RoadmapAuthor>by. {roadmap.authorNickname}</RoadmapAuthor>
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
