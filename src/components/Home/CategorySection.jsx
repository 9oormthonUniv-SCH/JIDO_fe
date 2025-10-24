import  { useState } from "react";
import styled from "styled-components";

const CategoryContainer = styled.div`
  background: #ffffff;
  padding: 10px;
  margin-top: 30px;
`;

const CategoryBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
`;

const MainCategory = styled.div`
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
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 5px;
  z-index: 100;
  min-width: 160px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
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

function CategorySection({ categories, selectedCategory, filterRoadmaps, categoryMap }) {
  const [activeMain, setActiveMain] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

const handleMainClick = (main) => {
  const path = main; // 대분류 path
  const selectedId = categoryMap[path];
  console.log("[CATEGORY CLICK - MAIN]", path, "→", selectedId);

  setActiveMain(activeMain === main ? null : main);
  setActiveSub(null);
  filterRoadmaps(selectedId || null); // ✅ 대분류만 선택해도 해당 로드맵
};

const handleMiddleClick = (main, sub) => {
  const path = `${main} > ${sub}`; // 중분류 path
  const selectedId = categoryMap[path];
  console.log("[CATEGORY CLICK - MIDDLE]", path, "→", selectedId);

  setActiveSub(activeSub === path ? null : path);
  filterRoadmaps(selectedId || null); // ✅ 중분류 선택 시 중분류+하위 전부 필터
};

const handleSubClick = (fullPath, item, e) => {
  e.stopPropagation();
  const path = `${fullPath} > ${item}`; // 소분류 path
  const selectedId = categoryMap[path];
  console.log("[CATEGORY CLICK - SUB]", path, "→", selectedId);

  filterRoadmaps(selectedId || null); // ✅ 소분류까지 지정
  setActiveMain(null);
  setActiveSub(null);
};

  return (
    <CategoryContainer>
      <CategoryBox>
        <MainCategory
          active={selectedCategory === "전체 로드맵"}
          onClick={() => {
            setActiveMain(null);
            setActiveSub(null);
            filterRoadmaps(null);
          }}
        >
          전체
        </MainCategory>

        {Object.keys(categories).map((main) => (
          <MainCategory
            key={main}
            active={activeMain === main}
            onClick={() => handleMainClick(main)}
          >
            {main}
          </MainCategory>
        ))}
      </CategoryBox>

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

                {isActiveSub && (
                  <SubSubCategoryMenu>
                    {categories[main][sub].map((item) => (
                      <SubSubCategoryItem
                        key={item}
                        onClick={(e) => handleSubClick(fullPath, item, e)}
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
