//나의로드맵페이지

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";

const Container=styled.div`
   display:flex;
   flex-direction:column;
   max-width: 960px;
   margin-left:60px;
   margin-top:90px;
`;

const MyFavorite=styled.div`
   display:flex;
   gap:10px;
      flex-wrap:wrap;
`;

const MyRoadmap=styled.div`
   display:flex;
   gap:10px;
   flex-wrap:wrap;
`;

const Label=styled.p`
  font-size:25px;
  font-weight:bold;
  color:black;
  margin-left:10px;
`;

function MyPage(){
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('nickname');
    if (stored) setNickname(stored);
  }, []);

  return(
   <>
    <TopHeader nickname={nickname} />
    <Container>
      <Label>나의 로드맵</Label>
      <MyRoadmap></MyRoadmap>

      <Label>북마크한 로드맵</Label>


       <MyFavorite>
        <Label>내가 좋아하는 로드맵</Label>
      </MyFavorite>
    </Container>
    </>
  );
}

export default MyPage;
