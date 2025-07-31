import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import SideNav from "../components/SideNav";
import { useNavigate } from "react-router-dom";
import PI from "../assets/PI.png";  // 이미지 import 추가





const HomeContainer=styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:10px;
  background-color: #fafdfb;
  margin-top: 90px; 
`;


const WelcomeContainer=styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fafdfb;

  

`;


const WelcomeImg=styled.img`
  width:500px;
  border-radius:5px;
  height:400px;
  margin-left:40px;
  
`;

const WelcomeText = styled.div`
font-size: 32px;
  font-weight: bold;
  margin-right:50px;

  

`;



const RoadmapContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: flex-start;
  margin-left:40px;
  margin-bottom:40px;
`;

const RoadmapCard = styled.div`
  width:350px;
  height:200px;
  border-radius:16px;
  background:#fafdfb;
  text-align:center;
  cursor:pointer;
  border:2px solid  #2e5c4d;
  &:hover{box-shadow:0 6px 15px black;}

`;

const PopularRoadmap = styled.div`
  font-size:27px;
  font-weight:bold;
  margin-right:auto;
  margin-top:70px;
  margin-left:30px;
`;

const RoadmapTitle=styled.h1`
   font-size:20px;


`;


const RoadmapDescription=styled.p`
    font-size:15px;

`;

const RoadmapAuthor=styled.p`
    font-size:15px;
    color:black;


`;
function Home() {
  const [nickname, setNickname] = useState("");
  const [roadmaps, setRoadmaps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("nickname");
    if (stored) setNickname(stored);

    const savedRoadmaps = JSON.parse(localStorage.getItem("roadmaps")) || [];
    setRoadmaps(savedRoadmaps);
  }, []);

  return (
    <>
      <TopHeader nickname={nickname} />
      <HomeContainer>
        <WelcomeContainer>
          <WelcomeImg src={PI} alt="intro" /> 
          <WelcomeText>JIDO는 당신의 목표까지 함께합니다.<br />
            <span style={{ color: "#2e5c4d" }}>지금 바로 시작해보세요!</span>
          </WelcomeText>
        </WelcomeContainer>

    <PopularRoadmap>🔥인기 있는 로드맵</PopularRoadmap>
      
          <RoadmapContainer>
            {roadmaps.map((roadmap, idx) => (
              <RoadmapCard key={idx} onClick={() => navigate("/RoadmapDetail")}>
               <RoadmapTitle>{roadmap.title}</RoadmapTitle>
               <RoadmapDescription>{roadmap.description}</RoadmapDescription>
               <RoadmapAuthor>{roadmap.author}</RoadmapAuthor>
              </RoadmapCard>
            ))}
          </RoadmapContainer>
         
     
      </HomeContainer>
    </>
  );
}

export default Home;
