import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaReply, FaTrash, FaBookmark,FaRegBookmark} from "react-icons/fa";

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [likeState, setLikeState] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentState, setCommentState] = useState("");
  const [replyState, setReplyState] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [bookmark,setBookmark]=useState(false);
  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedProfileImg = localStorage.getItem("profileImg");
    if (storedNickname) setNickname(storedNickname);
    if (storedProfileImg) setProfileImg(storedProfileImg);

    const roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || [];
    if (roadmaps.length > 0 && id < roadmaps.length) {
      setRoadmap(roadmaps[id]);
    }
  }, [id]);

  const handleDeletePost = () => { 
    const roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || [];
    const postId = Number(id);
    
    if(postId >=0 && postId < roadmaps.length){
      roadmaps.splice(postId,1);
      localStorage.setItem("roadmaps",JSON.stringify(roadmaps));
      alert("로드맵이 삭제되었습니다");
      navigate("/");

    }else {
      alert("오루가 발생하였습니다")
    }
  };
    
  const handleLike = () => setLikeState((prev) => !prev);

  const handleComment = () => {
    if (commentState.trim() === "") return;
    setComments((prev) => [
      ...prev,
      {
        user: nickname || "익명",
        text: commentState,
        img: profileImg || "/default_profile.png",
        likes: 0,
        liked: false,
        replies: [],
      },
    ]);
    setCommentState("");
  };

  const handleDeleteComment = (index) => {
    setComments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleLikeComment = (index) => {
    setComments((prev) =>
      prev.map((comment, idx) =>
        idx === index
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const handleReply = (index) => {
    if (replyState.trim() === "") return;
    setComments((prev) =>
      prev.map((comment, idx) =>
        idx === index
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  user: nickname || "익명",
                  text: replyState,
                },
              ],
            }
          : comment
      )
    );
    setReplyState("");
    setReplyTarget(null);
  };

  const handleBookmark = () => { setBookmark(prev=> !prev);};

  return (
    <>
      <TopHeader nickname={nickname} />
     
      <Container>
      
       {roadmap?.author === nickname && (
         <ContainerButton>
           <BookmarkButton onClick={handleBookmark}>
          {bookmark ? <FaBookmark /> : <FaRegBookmark />}북마크</BookmarkButton>
          <DeleteContainer>
        <DeleteButton onClick={handleDeletePost}>삭제</DeleteButton>
        <UpdateButton onClick={()=>navigate(`/edit/${id}`)}>수정</UpdateButton>
         </DeleteContainer>
  
      </ContainerButton>
       )}
       
      
        <AllContainer>
          <Title>{roadmap?.title || "제목 없음"}</Title>
          {roadmap?.category && <CategoryPath>{roadmap.category}</CategoryPath>}
          <Author>작성자 : {roadmap?.author || "익명"}</Author>
          <Description>{roadmap?.description || "설명 없음"}</Description>
        </AllContainer>

        <LevelsContainer>
          {roadmap?.levels?.map((level, idx) => (
            <LevelBlock key={idx}>
              <LevelTitle>Lv.{idx + 1}</LevelTitle>
              <StepContainer>
                {level.steps.map((step, stepIdx) => (
                  <StepBox key={stepIdx}>
                    <StepTitle>{step.title || "제목 없음"}</StepTitle>
                    {step.checklist.map((item, itemIdx) => (
                      <ChecklistItem key={itemIdx}>
                        <input type="checkbox" disabled />
                        <span>{item || "체크리스트 없음"}</span>
                      </ChecklistItem>
                    ))}
                  </StepBox>
                ))}
              </StepContainer>
            </LevelBlock>
          ))}
        </LevelsContainer>

        <BottomContainer>
          <LikeContainer onClick={handleLike}>
            {likeState ? "♥ 좋아요" : "♡ 좋아요"}
          </LikeContainer>

          <CommentContainer>
            <CommentInput
              type="text"
              placeholder="댓글을 입력해주세요"
              value={commentState}
              onChange={(e) => setCommentState(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleComment();
                }
              }}
            />
            <CommentButton onClick={handleComment}>입력</CommentButton>
          </CommentContainer>

          <CommentList>
            {comments.map((comment, idx) => (
              <div key={idx}>
                <CommentDetail>
                  <CommentImg src={comment.img} alt="profile" />
                  <CommentText>
                    <CommentName>{comment.user}</CommentName>
                    {comment.text}
                    <CommentActions>
                      <span onClick={() => handleLikeComment(idx)}>
                        {comment.liked ? <FaHeart color="red" /> : <FaRegHeart />}{" "}
                        {comment.likes}
                      </span>
                      <span onClick={() => setReplyTarget(idx)}>
                        <FaReply /> 대댓글
                      </span>
                      <span onClick={() => handleDeleteComment(idx)}>
                        <FaTrash /> 삭제
                      </span>
                    </CommentActions>
                  </CommentText>
                </CommentDetail>

                {replyTarget === idx && (
                  <ReplyContainer>
                    <CommentInput
                      type="text"
                      placeholder="대댓글 입력"
                      value={replyState}
                      onChange={(e) => setReplyState(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleReply(idx);
                        }
                      }}
                    />
                    <CommentButton onClick={() => handleReply(idx)}>작성</CommentButton>
                  </ReplyContainer>
                )}

                {comment.replies.map((reply, rIdx) => (
                  <ReplyItem key={rIdx}>
                    <ReplyName>{reply.user}</ReplyName>
                    <ReplyText>{reply.text}</ReplyText>
                  </ReplyItem>
                ))}
              </div>
            ))}
          </CommentList>
        </BottomContainer>
      </Container>
    </>
  );
}

export default RoadmapDetail;
