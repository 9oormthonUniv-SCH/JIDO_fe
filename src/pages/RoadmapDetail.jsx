import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaReply, FaTrash, FaBookmark,FaRegBookmark} from "react-icons/fa";
import {getRoadmapDetail,} from "../api/roadmap";
import {addLike, removeLike, addBookmark, removeBookmark, fetchLikeStatus, fetchBookmarkStatus ,} from "../api/roadmapLike";
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

  const userId = localStorage.getItem("userId");

  const [roadmap, setRoadmap] = useState(null);
  const [sections, setSections] = useState([]);
  const [nickname, setNickname] = useState("");

  const [likeState, setLikeState] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [bookmark, setBookmark] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentState, setCommentState] = useState("");
  const [replyState, setReplyState] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);

  const [loading, setLoading] = useState(false);

  // 연타 방지
  const [likeBusy, setLikeBusy] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);

  // 상세 + 좋아요/북마크 상태 동시 동기화
  const fetchDetail = async (rid) => {
    setLoading(true);
    try {
      const [rm, likeInfo, bmInfo] = await Promise.all([
        getRoadmapDetail(rid),
        fetchLikeStatus(rid),
        fetchBookmarkStatus(rid),
      ]);

      setRoadmap(rm);
      setSections(rm.sections || []);
      setNickname(rm.authorNickname ?? "");

      setLikeState(!!likeInfo?.liked);
      setLikeCount(likeInfo?.likeCount ?? rm.likeCount ?? 0);

      setBookmark(!!bmInfo?.bookmarked);
      setBookmarkCount(bmInfo?.bookmarkCount ?? rm.bookmarkCount ?? 0);
    } finally {
      setLoading(false);
    }
  };

  // 마운트/ID 변경 시 서버 상태로 동기화
  useEffect(() => {
    if (!id) return;
    const rid = Number(id); // 숫자만 받는 백엔드 대비
    fetchDetail(rid);
  }, [id]);

  // 로드맵 삭제 (필요 시 실제 API로 교체)
  const handleDeletePost = () => {
    alert("로드맵이 삭제되었습니다");
    navigate("/");
  };

  // 좋아요 토글 (낙관적 업데이트 + 서버 정답 재확정)
  const handleLike = async () => {
    if (likeBusy) return;
    setLikeBusy(true);

    const rid = Number(id);
    const next = !likeState;

    setLikeState(next);
    setLikeCount((c) => Math.max(0, c + (next ? 1 : -1)));

    try {
      if (next) await addLike(rid);
      else await removeLike(rid);

      const latest = await fetchLikeStatus(rid);
      setLikeState(!!latest.liked);
      setLikeCount(latest.likeCount ?? 0);
    } catch (e) {
      setLikeState(!next);
      setLikeCount((c) => Math.max(0, c + (next ? -1 : 1)));
      if (e?.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        alert("좋아요 처리에 실패했어요. 다시 시도해 주세요.");
        console.error(e);
      }
    } finally {
      setLikeBusy(false);
    }
  };

  // 북마크 토글 (낙관적 업데이트 + 서버 정답 재확정)
  const handleBookmark = async () => {
    if (bookmarkBusy) return;
    setBookmarkBusy(true);

    const rid = Number(id);
    const next = !bookmark;

    setBookmark(next);
    setBookmarkCount((c) => Math.max(0, c + (next ? 1 : -1)));

    try {
      if (next) await addBookmark(rid);
      else await removeBookmark(rid);

      const latest = await fetchBookmarkStatus(rid);
      setBookmark(!!latest.bookmarked);
      setBookmarkCount(latest.bookmarkCount ?? 0);
    } catch (e) {
      setBookmark(!next);
      setBookmarkCount((c) => Math.max(0, c + (next ? -1 : 1)));
      if (e?.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        alert("북마크 처리에 실패했어요. 다시 시도해 주세요.");
        console.error(e);
      }
    } finally {
      setBookmarkBusy(false);
    }
  };

  // 댓글 관련 (필요 시 실제 API로 교체)
  const handleComment = async () => {
    if (!commentState.trim()) return;
    setComments((prev) => [
      ...prev,
      { user: "나", text: commentState, liked: false, likes: 0, replies: [], img: "" },
    ]);
    setCommentState("");
  };
  const handleDeleteComment = async (idx) => {
    setComments((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleLikeComment = async (idx) => {
    setComments((prev) =>
      prev.map((c, i) =>
        i === idx ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) } : c
      )
    );
  };
  const handleReply = async (idx) => {
    if (!replyState.trim()) return;
    setComments((prev) =>
      prev.map((c, i) =>
        i === idx ? { ...c, replies: [...c.replies, { user: "나", text: replyState }] } : c
      )
    );
    setReplyState("");
    setReplyTarget(null);
  };

  return (
    <>
     <TopHeader
  nickname={nickname}
   onLogoClick={() =>
     navigate("/", {
       state: {
         updatedId: Number(id),
         likeCount,
         bookmarkCount,
       },
     })
   }
/>
      <Container>
        <ContainerButton>
          <DeleteContainer>
            <UpdateButton onClick={() => navigate(`/edit/${id}`)}>수정</UpdateButton>
            <DeleteButton onClick={handleDeletePost}>삭제</DeleteButton>
          </DeleteContainer>

          {/* 북마크 버튼 */}
          <BookmarkButton
            onClick={bookmarkBusy ? undefined : handleBookmark}
            disabled={bookmarkBusy}
            style={{ opacity: bookmarkBusy ? 0.6 : 1 }}
          >
            {bookmark ? <FaBookmark /> : <FaRegBookmark />}{" "}
            {bookmarkBusy ? "처리중..." : "북마크"}
          </BookmarkButton>
        </ContainerButton>

        {roadmap && (
          <AllContainer>
            <Title>{roadmap.title}</Title>
            <CategoryPath>{roadmap.category}</CategoryPath>
            <Description>{roadmap.description}</Description>
            <Author>작성자: {roadmap.authorNickname}</Author>
            <p>좋아요: {likeCount}, 북마크: {bookmarkCount}</p>
          </AllContainer>
        )}

        {/* 좋아요 버튼 */}
        <LikeContainer
          onClick={likeBusy ? undefined : handleLike}
          style={{ opacity: likeBusy ? 0.6 : 1 }}
        >
          {likeState ? <FaHeart /> : <FaRegHeart />}
          <span style={{ marginLeft: 8 }}>{likeBusy ? "처리중..." : "좋아요"}</span>
        </LikeContainer>

        {/* 레벨/스텝/체크리스트 */}
        <LevelsContainer>
          {sections.map((sec) => (
            <LevelBlock key={sec.sectionId}>
              <LevelTitle>
                Lv.{sec.sectionNum} {sec.title}
              </LevelTitle>

              <StepContainer>
                {sec.steps?.map((step) => (
                  <StepBox key={step.stepId}>
                    <StepTitle>{step.title}</StepTitle>
                    {step.contents?.map((c) => (
                      <ChecklistItem key={c.stepContentId}>
                        <input type="checkbox" checked={c.finished} readOnly /> {c.content}
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
