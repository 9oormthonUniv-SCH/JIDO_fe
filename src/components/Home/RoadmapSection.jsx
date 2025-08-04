import React from "react";
import CategorySection from "./CategorySection.jsx";
import RoadmapList from "./RoadmapList.jsx";

function RoadmapSection(props) {
  return (
    <>
      <CategorySection {...props} />
      <RoadmapList
        selectedCategory={props.selectedCategory}
        filteredRoadmaps={props.filteredRoadmaps}
        handleCardClick={props.handleCardClick}
      />
    </>
  );
}

export default RoadmapSection;
