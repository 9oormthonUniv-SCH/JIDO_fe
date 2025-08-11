import React, { useState } from "react";
import styled from "styled-components";

const CategoryContainer = styled.div`
  background: #ffffff;
  padding:10px;
  margin-top: 30px;
`;

//대분류 중뷴류 카테고리 박스
const CategoryBox = styled.div`
  display:flex;
  justify-content:center;
  gap:40px;

`;

const MainCategory = styled.div`
  font-size:18px;
  font-weight:bold;
  color: #2e5c4d;
  cursor:pointer;
  padding: 10px;
  border-radius:6px;
  background:${(props) => (props.active ? "#e6f2ef" : "transparent")};

  &:hover {
    background: #e6f2ef;
  }
`;

const SubCategoryBox = styled.div`
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


function CategorySection({ categories, selectedCategory, filterRoadmaps }) {
  const [activeMain, setActiveMain] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  const handleMainClick = (main) => {
    setActiveMain(activeMain === main ? null : main); 
    setActiveSub(null);
    filterRoadmaps(main);
  };

  const handleMiddleClick = (main, sub) => {
    const chooselist = `${main} > ${sub}`;
    setActiveSub(activeSub === chooselist ? null : chooselist);
    filterRoadmaps(chooselist);
  };


  const handleSubClick = (fullPath, item, e) => {
    e.stopPropagation(); 
    filterRoadmaps(`${fullPath} > ${item}`);
    setActiveMain(null);
    setActiveSub(null);
  };

  return (
    <CategoryContainer>
     
     {/*상단 카테고리 박스들 */}
      <CategoryBox>
        <MainCategory
          active={selectedCategory === "전체 로드맵"}
          onClick={() => { setActiveMain(null);  setActiveSub(null); filterRoadmaps("전체");}}>전체
        </MainCategory>

        {Object.keys(categories).map((main) => (
          <MainCategory key={main}  active={activeMain === main}  onClick={() => handleMainClick(main)}>{main}</MainCategory>))}
      </CategoryBox>

      {/* 마지막 카테고리 */}
      {Object.keys(categories).map((main) => (
        <SubCategoryBox key={main} active={activeMain === main}>
          {Object.keys(categories[main]).map((sub) => {
            const fullPath = `${main} > ${sub}`;
            const isActiveSub = activeSub === fullPath;

            return (
              <SubCategoryItem
                key={sub}
                onClick={() => handleMiddleClick(main, sub)}
              >
                {sub}

                {/* 서브-서브 메뉴 */}
                {isActiveSub && (
                  <SubSubCategoryMenu>
                    {categories[main][sub].map((item) => (
                      <SubSubCategoryItem
                        key={item}
                        onClick={(e) =>
                          handleSubClick(fullPath, item, e)
                        }
                      >
                        {item}
                      </SubSubCategoryItem>
                    ))}
                  </SubSubCategoryMenu>
                )}
              </SubCategoryItem>
            );
          })}
        </SubCategoryBox>
      ))}
    </CategoryContainer>
  );
}

export default CategorySection;