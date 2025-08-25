import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaReply, FaTrash, FaBookmark,FaRegBookmark} from "react-icons/fa";
import {getRoadmapDetail,} from "../api/roadmap";
import {addLike, removeLike, addBookmark, removeBookmark,} from "../api/roadmapLike";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding-top: 80px;
  box-sizing: border-box;
  margin-top: 50px;
`;

const AllContainer = styled.div`
  width: 900px;
  background: #fafdfb;
  border-radius: 30px;
  border: 2px solid #2e5c4d;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px 30px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  // position: relative; 
`;
const ContainerButton = styled.div`
  display: flex;
  justify-content: space-between;   /* 양 끝 배치 */

  width: 100%;
  max-width: 900px;                 /* AllContainer와 폭 맞춤 */
  padding: 0 20px;                  /* 좌우 여백 */

  margin-top: 8px;
`;

const DeleteContainer =styled.div`

display:flex;
gap:10px;
margin-left:auto;


`;

const BookmarkButton =styled.button`
  background-color:#fafdfb;
  color: #2e5c4d;
   font-size: 20px;
   cursor: pointer;
   display: flex;
   align-items: center;
   gap: 6px;
   border:none;
   font-weight:bold;
   margin-left:20px;
  //  position: absolute;  
  //   top: 16px;
  //   right: 16px;


`;


const DeleteButton = styled.button`
  background-color: #e57373;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;


const UpdateButton = styled.button`
  background-color: #64b5f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #1976d2;
  }
`;


const Title = styled.h1`
  font-weight: bold;
  font-size: 36px;
  margin: 0;
  text-align: center;
  color: #2e5c4d;
`;

const CategoryPath = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #666;
  background: #f2f5f4;
  border-radius: 20px;
  padding: 6px 14px;
  display: inline-block;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 20px 0 0;
  line-height: 1.5;
  width: 80%;
  text-align: center;
`;

const Author = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0 0;
  color: #555;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 900px;
  margin-top: 10px;
`;

const LikeContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
  color: #2e5c4d;
`;

const CommentContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const CommentInput = styled.input`
  flex: 1;
  height: 45px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid #c3d4ce;
  font-size: 14px;

  &:focus {
    outline: 2px solid #2e5c4d;
  }
`;

const CommentButton = styled.button`
  border-radius: 10px;
  background-color: #2e5c4d;
  color: white;
  font-weight: bold;
  border: none;
  width: 80px;
  height: 45px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #24493d;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CommentDetail = styled.div`
  font-size: 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom:30px;
`;

const CommentImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #c3d4ce;
`;

const CommentText = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CommentName = styled.span`
  font-weight: bold;
  font-size: 13px;
  color: #2e5c4d;
  margin-bottom: 5px;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
  font-size: 12px;
  color: #555;
  cursor: pointer;

  svg {
    margin-right: 5px;
  }
`;

const ReplyContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 5px 0 10px 45px;
`;

const ReplyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: 45px;
  padding: 5px 10px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const ReplyName = styled.span`
  font-weight: bold;
  font-size: 12px;
  color: #2e5c4d;
`;

const ReplyText = styled.span`
  font-size: 13px;
`;

const LevelsContainer = styled.div`
  width: 900px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LevelBlock = styled.div`
  border: 1px solid #c3d4ce;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
`;

const LevelTitle = styled.h2`
  font-size: 18px;
  color: #2e5c4d;
  margin-bottom: 10px;
`;

const StepTitle = styled.h3`
  font-size: 16px;
  margin: 5px 0;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const StepContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const StepBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #fff;
  padding: 15px;
  width: 200px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

function RoadmapDetail() {
  const { id } = useParams(); // URL의 roadmapId


  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); // 로그인 시 저장해둔 userId
  console.log(userId);

  const [roadmap, setRoadmap] = useState(null);
  const [sections, setSections] = useState([]);
  const [nickname, setNickname] = useState("");
  const [bookmark, setBookmark] = useState(false);
  const [likeState, setLikeState] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentState, setCommentState] = useState("");

  const [replyState, setReplyState] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);
  const [loading, setLoading] = useState(false);

// useEffect(() => {
//   if (!id) return; // id 없으면 중단
//   console.log(id);

//   (async () => {
//     try {
//       setLoading(true);

//       // 1) 로드맵 기본 정보
//       const rm = await getRoadmap(id);
//       console.log("로드맵 기본 정보:", rm);
//       setRoadmap(rm);

//       // 2) 이 로드맵의 섹션들만
//       const rawSections = await listSections(id);
//       console.log("섹션 목록:", rawSections);

//       const attachContentsToStep = async (step) => {
//         const contents = await listStepContents(step.stepId);
//         return { ...step, stepContents: contents };
//       };

         
//        const attachStepsToSection = async (sec) => {
//         const steps = await listSteps(sec.sectionId);
//         //스텝배열
//         const stepsWithContents = await Promise.all(
//           steps.map(attachContentsToStep)
//         );
//         return { ...sec, steps: stepsWithContents };
//       };
   
//       // 3) 섹션 → 스텝 → 콘텐츠까지 합치기
//       //섹샨배열
//       const fullSections = await Promise.all(
//         rawSections.map(attachStepsToSection)
//       );

//       setSections(fullSections);
//     } catch (e) {
//       console.error("로드맵 상세 불러오기 실패", e);
//     } finally {
//       setLoading(false);
//     }
//   })();
// }, [id]);

useEffect(() => {
  if (!id) return;

  (async () => {
    try {
      setLoading(true);

      const rm = await getRoadmapDetail(id);
      
      console.log("[로드맵 상세]", rm);

      setRoadmap(rm);
      setSections(rm.sections || []); // detail 응답에 sections가 바로 들어있음

      // 좋아요/북마크 초기 상태도 같이 세팅
      setLikeState(rm.likedByMe);
      setBookmark(rm.bookmarkedByMe);

    } catch (e) {
      console.error("로드맵 상세 불러오기 실패", e);
    } finally {
      setLoading(false);
    }
  })();
}, [id]);





  // 로드맵 삭제
  const handleDeletePost = () => {
    // 실제 API deleteRoadmap(id) 연결 필요
    alert("로드맵이 삭제되었습니다");
    navigate("/");
  };

  // 좋아요 토글
  const handleLike = async () => {
    try {
      if (likeState) {
        await removeLike(id);
        console.log(id);
        setRoadmap((prev) => ({ ...prev, likeCount: prev.likeCount - 1 }));
      } else {
        await addLike(id);
        setRoadmap((prev) => ({ ...prev, likeCount: prev.likeCount + 1 }));
      }
      setLikeState((prev) => !prev);
    } catch (err) {
      console.error("좋아요 실패", err);
    }
  };

  // 북마크 토글
  const handleBookmark = async () => {
    try {
      if (bookmark) {
        await removeBookmark(id);
        setRoadmap((prev) => ({...prev,bookmarkCount: prev.bookmarkCount - 1, }));
      } else {
        await addBookmark(id);
        setRoadmap((prev) => ({...prev,bookmarkCount: prev.bookmarkCount + 1,}));
      }
      setBookmark((prev) => !prev);
    } catch (err) {
      console.error("북마크 실패", err);
    }
  };

  // 댓글 작성
  const handleComment = async () => {
    if (commentState.trim() === "") return;
    try {
      const newComment = await addComment(id, commentState);
      setComments((prev) => [...prev, newComment]);
      setCommentState("");
    } catch (err) {
      console.error("댓글 등록 실패", err);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (err) {
      console.error("댓글 삭제 실패", err);
    }
  };

  // 댓글 좋아요
  const handleLikeComment = async (commentId) => {
    try {
      const updated = await likeComment(commentId);
      setComments((prev) =>
        prev.map((c) => (c.commentId === commentId ? updated : c))
      );
    } catch (err) {
      console.error("댓글 좋아요 실패", err);
    }
  };

  // 답글 작성
  const handleReply = async (commentId) => {
    if (replyState.trim() === "") return;
    try {
      const newReply = await replyComment(commentId, replyState);
      setComments((prev) =>
        prev.map((c) =>
          c.commentId === commentId
            ? { ...c, replies: [...c.replies, newReply] }
            : c
        )
      );
      setReplyState("");
      setReplyTarget(null);
    } catch (err) {
      console.error("답글 실패", err);
    }
  };

return (
    <>
      <TopHeader nickname={nickname} />
      
        {/* 수정/삭제 버튼 */}
        

      <Container>
        <ContainerButton>
          <DeleteContainer>
            <UpdateButton onClick={() => navigate(`/edit/${id}`)}>수정</UpdateButton>
            <DeleteButton onClick={handleDeletePost}>삭제</DeleteButton>
          </DeleteContainer>
          <BookmarkButton onClick={handleBookmark}>
            {bookmark ? <FaBookmark /> : <FaRegBookmark />} 북마크
          </BookmarkButton>
        </ContainerButton>


        {/* 로드맵 정보 */}
        {roadmap && (
          <AllContainer>
            <Title>{roadmap.title}</Title>
            <CategoryPath>{roadmap.category}</CategoryPath>
            <Description>{roadmap.description}</Description>
            <Author>작성자: {roadmap.authorNickname}</Author>
            <p>좋아요: {roadmap.likeCount}, 북마크: {roadmap.bookmarkCount}</p>
          </AllContainer>
        )}

        {/* 좋아요 버튼 */}
        <LikeContainer onClick={handleLike}>
          {likeState ? <FaHeart /> : <FaRegHeart />}
          <span style={{ marginLeft: "8px" }}>좋아요</span>
        </LikeContainer>

        {/* 레벨/스텝/체크리스트 */}
      <LevelsContainer>
  {sections.map((sec) => (
    <LevelBlock key={sec.sectionId}>
      <LevelTitle>
        Lv.{sec.sectionNum} {sec.title}
      </LevelTitle>

      <StepContainer>
        {sec.steps.map((step) => (
          <StepBox key={step.stepId}>
            <StepTitle>{step.title}</StepTitle>
            {step.contents.map((c) => (   // ✅ 여기 이름만 contents
              <ChecklistItem key={c.stepContentId}>
                <input type="checkbox" checked={c.finished} readOnly />{" "}
                {c.content}
              </ChecklistItem>
            ))}
          </StepBox>
        ))}
      </StepContainer>
    </LevelBlock>
  ))}
</LevelsContainer>


        {/* 댓글 입력 */}
        <BottomContainer>
          <CommentContainer>
            <CommentInput
              value={commentState}
              onChange={(e) => setCommentState(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <CommentButton onClick={handleComment}>등록</CommentButton>
          </CommentContainer>

          {/* 댓글 목록 */}
          <CommentList>
            {comments.map((c, idx) => (
              <CommentDetail key={idx}>
                <CommentImg src={c.img} alt="profile" />
                <CommentText>
                  <CommentName>{c.user}</CommentName>
                  <span>{c.text}</span>
                  <CommentActions>
                    <span onClick={() => handleLikeComment(idx)}>
                      {c.liked ? <FaHeart /> : <FaRegHeart />} {c.likes}
                    </span>
                    <span onClick={() => setReplyTarget(idx)}>
                      <FaReply /> 답글
                    </span>
                    <span onClick={() => handleDeleteComment(idx)}>
                      <FaTrash /> 삭제
                    </span>
                  </CommentActions>

                  {/* 답글 입력 */}
                  {replyTarget === idx && (
                    <ReplyContainer>
                      <CommentInput
                        value={replyState}
                        onChange={(e) => setReplyState(e.target.value)}
                        placeholder="답글 입력..."
                      />
                      <CommentButton onClick={() => handleReply(idx)}>등록</CommentButton>
                    </ReplyContainer>
                  )}

                  {/* 답글 목록 */}
                  {c.replies.map((r, ridx) => (
                    <ReplyItem key={ridx}>
                      <ReplyName>{r.user}</ReplyName>
                      <ReplyText>{r.text}</ReplyText>
                    </ReplyItem>
                  ))}
                </CommentText>
              </CommentDetail>
            ))}
          </CommentList>
        </BottomContainer>
      </Container>
    </>
  );
}
export default RoadmapDetail;