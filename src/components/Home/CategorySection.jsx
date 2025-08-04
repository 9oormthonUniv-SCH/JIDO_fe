import React, { useState } from "react";
import styled from "styled-components";

// 스타일 정의 시작
const CategoryContainer = styled.div`
  position: relative;
  background: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #eee;
  margin-top: 30px;
  border-radius: 8px;
`;

const CategoryRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
`;

const MainCategory = styled.div`
  position: relative;
  font-size: 18px;
  font-weight: bold;
  color: #2e5c4d;
  cursor: pointer;
  padding: 10px;
  border-radius: 6px;
  background: ${(props) => (props.active ? "#e6f2ef" : "transparent")};

  &:hover {
    background: #e6f2ef;
  }
`;

const SubCategoryRow = styled.div`
  display: ${(props) => (props.active ? "flex" : "none")};
  justify-content: center;
  gap: 25px;
  margin-top: 18px;
  padding: 10px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  flex-wrap: wrap;
`;

const SubCategoryItem = styled.div`
  position: relative;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;

  &:hover {
    background: #f0f0f0;
  }
`;

const SubSubCategoryMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);       // ✅ 부모 아래로 약간 띄우기
  left: 50%;                   // 가운데 정렬 시작
  transform: translateX(-50%); // 가운데 정렬 완성
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 5px;
  z-index: 100;
  min-width: 160px;            // ✅ 충분한 너비 확보
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;         // ✅ 줄바꿈 방지
`;


const SubSubCategoryItem = styled.div`
  font-size: 13px;
  padding: 5px 10px;
  color: #555;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;
// 스타일 정의 끝

function CategorySection({
  categories,
  activeCategory,
  selectedCategory,
  setActiveCategory,
  filterRoadmaps,
}) {
  const [activeSubCategory, setActiveSubCategory] = useState(null); // ✅ 소분류 제어 상태

  return (
    <CategoryContainer>
      <CategoryRow>
        <MainCategory
          active={selectedCategory === "전체 로드맵"}
          onClick={() => {
            setActiveCategory(null);
            setActiveSubCategory(null);
            filterRoadmaps("전체");
          }}
        >
          전체
        </MainCategory>

        {Object.keys(categories).map((mainList, idx) => (
          <MainCategory
            key={idx}
            active={activeCategory === mainList}
            onClick={() => {
              const isSame = activeCategory === mainList;
              setActiveCategory(isSame ? null : mainList);
              setActiveSubCategory(null); // 대분류 바꾸면 소분류 초기화
              filterRoadmaps(mainList);
            }}
          >
            {mainList}
          </MainCategory>
        ))}
      </CategoryRow>

      {Object.keys(categories).map((mainList, idx) => (
        <SubCategoryRow key={idx} active={activeCategory === mainList}>
          {Object.keys(categories[mainList]).map((subList, subIdx) => {
            const fullPath = `${mainList} > ${subList}`;
            const isActiveSub = activeSubCategory === fullPath;

            return (
              <SubCategoryItem
                key={subIdx}
                onClick={() => {
                  setActiveSubCategory(isActiveSub ? null : fullPath);
                  filterRoadmaps(fullPath);
                }}
              >
                {subList}
                {isActiveSub && (
                  <SubSubCategoryMenu>
                    {categories[mainList][subList].map((item, itemIdx) => (
                     <SubSubCategoryItem
  key={itemIdx}
  onClick={(e) => {
    e.stopPropagation(); // 부모 중분류 클릭 방지
    filterRoadmaps(`${fullPath} > ${item}`);
    setActiveCategory(null);          // ✅ 대분류 접기
    setActiveSubCategory(null);       // ✅ 소분류 접기
  }}
>
  {item}
</SubSubCategoryItem>
                    ))}
                  </SubSubCategoryMenu>
                )}
              </SubCategoryItem>
            );
          })}
        </SubCategoryRow>
      ))}
    </CategoryContainer>
  );
}

export default CategorySection;
