import { useEffect, useState } from "react";
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 960px;
  margin-left: 60px;
  margin-top: 90px;
`;

const MyFavorite = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const MyRoadmap = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Label = styled.p`
  font-size: 25px;
  font-weight: bold;
  color: black;
  margin-left: 10px;
`;

const RoadmapCard = styled.div`
  width: 250px;
  height: 160px;
  background: #fafdfb;
  border: 1px solid #2e5c4d;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background: #e6f2ef;
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #2e5c4d;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
`;

const CardAuthor = styled.p`
  font-size: 12px;
  color: #888;
`;

function MyPage() {
  const [nickname, setNickname] = useState("");
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [bookmarkedRoadmaps, setBookmarkedRoadmaps] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) setNickname(storedNickname);

    const storedRoadmaps = JSON.parse(localStorage.getItem("roadmaps")) || [];
    setRoadmaps(storedRoadmaps);

    const myRoadmapsData = storedRoadmaps.filter(
      (roadmap) => roadmap.author === storedNickname
    );
    setMyRoadmaps(myRoadmapsData);

    // 북마크한 로드맵 불러오기
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const bookmarkedData = bookmarks
      .map((id) => storedRoadmaps[id])
      .filter(Boolean);
    setBookmarkedRoadmaps(bookmarkedData);
  }, []);

  const handleNavigate = (roadmap) => {
    const indexInAll = roadmaps.findIndex((r) => r === roadmap);
    navigate(`/roadmap/${indexInAll}`);
  };

  return (
    <>
      <TopHeader nickname={nickname} />
      <Container>
        <Label>나의 로드맵</Label>
        <MyRoadmap>
          {myRoadmaps.length > 0 ? (
            myRoadmaps.map((roadmap, idx) => (
              <RoadmapCard key={idx} onClick={() => handleNavigate(roadmap)}>
                <CardTitle>{roadmap.title}</CardTitle>
                <CardDescription>
                  {roadmap.description.length > 40
                    ? roadmap.description.slice(0, 40) + "..."
                    : roadmap.description}
                </CardDescription>
                <CardAuthor>작성자 : {roadmap.author}</CardAuthor>
              </RoadmapCard>
            ))
          ) : (
            <p>작성한 로드맵이 없습니다.</p>
          )}
        </MyRoadmap>

        <Label>북마크한 로드맵</Label>
        <MyFavorite>
          {bookmarkedRoadmaps.length > 0 ? (
            bookmarkedRoadmaps.map((roadmap, idx) => (
              <RoadmapCard key={idx} onClick={() => handleNavigate(roadmap)}>
                <CardTitle>{roadmap.title}</CardTitle>
                <CardDescription>
                  {roadmap.description.length > 40
                    ? roadmap.description.slice(0, 40) + "..."
                    : roadmap.description}
                </CardDescription>
                <CardAuthor>작성자 : {roadmap.author}</CardAuthor>
              </RoadmapCard>
            ))
          ) : (
            <p>북마크한 로드맵이 없습니다.</p>
          )}
        </MyFavorite>
      </Container>
    </>
  );
}

export default MyPage;
