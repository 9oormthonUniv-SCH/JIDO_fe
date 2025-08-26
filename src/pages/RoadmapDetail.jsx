import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaTrash, FaBookmark, FaRegBookmark, FaEdit } from "react-icons/fa";
import {
  getRoadmapDetail,
  listCategories,
  deleteRoadmap,
  listRoadmapComments,
  createRoadmapComment,
  updateRoadmapComment,
  deleteRoadmapComment,    // ✅ 누락 추가
  addCommentLike,          // ✅ 정확한 이름
  removeCommentLike        // ✅ 정확한 이름
} from "../api/roadmap";
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

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 5px;
  font-size: 12px;
  align-items: center;
`;

const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #555;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #eef3f1;       /* 연한 초록 톤 배경 */
    color: #2e5c4d;             /* 브랜드 컬러 텍스트 */
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(GhostButton)`
  color: #c62828;
  &:hover {
    background: #fdecea;        /* 연한 레드 배경 */
    color: #b71c1c;
  }
`;

function RoadmapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 로그인 정보(수정/삭제 버튼 노출용)
  const myId = Number(localStorage.getItem("userId"));
  const myNickname = localStorage.getItem("nickname") || "";

  const [roadmap, setRoadmap] = useState(null);
  const [sections, setSections] = useState([]);
  const [nickname, setNickname] = useState("");

  // 로드맵 좋아요/북마크
  const [likeState, setLikeState] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmark, setBookmark] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // 댓글
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [replyTarget, setReplyTarget] = useState(null);
const [replyText, setReplyText] = useState("");


  // busy flags
  const [loading, setLoading] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 카테고리 path 표시
  const [catMap, setCatMap] = useState(null);

  // 댓글/대댓글 트리에서 특정 commentId를 찾아 updater로 변경
const updateCommentInTree = (list, targetId, updater) => {
  return list.map((c) => {
    if (c.commentId === targetId) {
      return updater(c);
    }
    if (Array.isArray(c.replies) && c.replies.length) {
      return {
        ...c,
        replies: updateCommentInTree(c.replies, targetId, updater),
      };
    }
    return c;
  });
};

// 댓글/대댓글 트리에서 특정 commentId를 제거(삭제)할 때 사용 (선택)
const deleteCommentInTree = (list, targetId) => {
  return list
    .filter((c) => c.commentId !== targetId)
    .map((c) => ({
      ...c,
      replies: c.replies ? deleteCommentInTree(c.replies, targetId) : [],
    }));
};


  const buildIdToPathLabel = (cats) => {
    const byId = new Map(cats.map(c => [String(c.categoryId), c]));
    const idToPath = new Map();
    cats.forEach(c => {
      const names = [];
      let cur = c;
      while (cur) {
        names.unshift(cur.name);
        cur = cur.parentCategoryId ? byId.get(String(cur.parentCategoryId)) : null;
      }
      idToPath.set(String(c.categoryId), names.join(" > "));
    });
    return idToPath;
  };

  useEffect(() => {
    (async () => {
      try {
        const cats = await listCategories();
        setCatMap(buildIdToPathLabel(cats));
      } catch (e) {
        console.error("[카테고리 로드 실패]", e);
      }
    })();
  }, []);

  // ===== 댓글 좋아요 토글 =====
const handleToggleCommentLike = async (commentId, liked) => {
  try {
    if (liked) {
      await removeCommentLike(commentId);
    } else {
      await addCommentLike(commentId);
    }

    // 상태 갱신 (optimistic update or refetch)
    setComments(prev =>
      prev.map(c =>
        c.commentId === commentId
          ? {
              ...c,
              likedByMe: !liked,
              likeCount: (c.likeCount ?? 0) + (liked ? -1 : 1),
            }
          : c
      )
    );
  } catch (e) {
    console.error("[댓글 좋아요 실패]", e);
    alert("댓글 좋아요 처리에 실패했습니다.");
  }
};


  // 상세 + 좋아요/북마크 + 댓글
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

    // 댓글은 따로 예외 처리
    try {
      const list = await listRoadmapComments(rid);
      const sorted = (list || []).slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(sorted);
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401 || s === 403) {
        console.warn("댓글은 로그인 사용자만 조회 가능");
        // 필요시 안내/리다이렉트
        // alert("로그인 후 댓글을 볼 수 있어요.");
        // navigate("/login");
      } else {
        console.error("[댓글 조회 실패]", e);
      }
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (!id) return;
    fetchDetail(Number(id));
  }, [id]);

  // ===== 로드맵 삭제 =====
  const handleDeletePost = async () => {
    if (deleting) return;
    const rid = Number(id);
    if (!rid) return;
    if (!window.confirm("정말 삭제할까요? 되돌릴 수 없어요.")) return;
    try {
      setDeleting(true);
      await deleteRoadmap(rid);
      alert("로드맵이 삭제되었습니다.");
      navigate("/");
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401) {
        alert("로그인이 필요합니다."); navigate("/login");
      } else if (s === 403) {
        alert("삭제 권한이 없습니다.");
      } else if (s === 404) {
        alert("이미 삭제되었거나 존재하지 않습니다.");
      } else {
        alert("삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
      console.error("[로드맵 삭제 실패]", e);
    } finally {
      setDeleting(false);
    }
  };

  // ===== 좋아요 =====
  const handleLike = async () => {
    if (likeBusy) return;
    setLikeBusy(true);
    const rid = Number(id);
    const next = !likeState;

    // 낙관적 업데이트
    setLikeState(next);
    setLikeCount(c => Math.max(0, c + (next ? 1 : -1)));

    try {
      if (next) await addLike(rid); else await removeLike(rid);
      const latest = await fetchLikeStatus(rid);
      setLikeState(!!latest.liked);
      setLikeCount(latest.likeCount ?? 0);
    } catch (e) {
      // 롤백
      setLikeState(!next);
      setLikeCount(c => Math.max(0, c + (next ? -1 : 1)));
      if (e?.response?.status === 401) {
        alert("로그인이 필요합니다."); navigate("/login");
      } else {
        alert("좋아요 처리에 실패했어요. 다시 시도해 주세요.");
      }
      console.error(e);
    } finally {
      setLikeBusy(false);
    }
  };

  // ===== 북마크 =====
  const handleBookmark = async () => {
    if (bookmarkBusy) return;
    setBookmarkBusy(true);
    const rid = Number(id);
    const next = !bookmark;

    setBookmark(next);
    setBookmarkCount(c => Math.max(0, c + (next ? 1 : -1)));

    try {
      if (next) await addBookmark(rid); else await removeBookmark(rid);
      const latest = await fetchBookmarkStatus(rid);
      setBookmark(!!latest.bookmarked);
      setBookmarkCount(latest.bookmarkCount ?? 0);
    } catch (e) {
      setBookmark(!next);
      setBookmarkCount(c => Math.max(0, c + (next ? -1 : 1)));
      if (e?.response?.status === 401) {
        alert("로그인이 필요합니다."); navigate("/login");
      } else {
        alert("북마크 처리에 실패했어요. 다시 시도해 주세요.");
      }
      console.error(e);
    } finally {
      setBookmarkBusy(false);
    }
  };
  
const handleCreateReply = async (parentId) => {
  const rid = Number(id);
  const content = replyText.trim();
  if (!content) return;
  try {
    const created = await createRoadmapComment(rid, content, parentId);
    setComments(prev =>
      prev.map(c =>
        c.commentId === parentId
          ? { ...c, replies: [created, ...(c.replies || [])] }
          : c
      )
    );
    setReplyText("");
    setReplyTarget(null);
  } catch (e) {
    alert("대댓글 등록에 실패했어요.");
    console.error(e);
  }
};

  // ===== 댓글 작성 =====
  const handleCreateComment = async () => {
    const rid = Number(id);
    const content = newComment.trim();
    if (!content) return;
    try {
      const created = await createRoadmapComment(rid, content);
      setComments(prev => [created, ...prev]);
      setNewComment("");
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401) { alert("로그인이 필요합니다."); navigate("/login"); }
      else { alert("댓글 등록에 실패했어요."); }
      console.error("[댓글 등록 실패]", e);
    }
  };

  // ===== 댓글 수정 =====
  const startEdit = (c) => {
    setEditingId(c.commentId);
    setEditingText(c.content);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };
 const submitEdit = async () => {
  const rid = Number(id);
  const cid = editingId;
  const content = editingText.trim();
  if (!cid || !content) return;

  // 실패 시 되돌릴 원본
  const prev = comments;

  // 1) 화면 먼저 반영(즉시 업데이트)
  const nowIso = new Date().toISOString();
  setComments((prevList) =>
    updateCommentInTree(prevList, cid, (old) => ({
      ...old,
      content,           // 새 내용
      updatedAt: nowIso, // "(수정됨)" 표시용
    }))
  );
  setEditingId(null);
  setEditingText("");

  try {
    // 2) 서버 반영
    const updated = await updateRoadmapComment(rid, cid, content);

    // 3) 서버가 돌려준 필드(정확한 updatedAt 등) 있으면 한 번 더 동기화
    if (updated) {
      setComments((prevList) =>
        updateCommentInTree(prevList, cid, (old) => ({
          ...old,
          ...updated,
        }))
      );
    }
  } catch (e) {
    // 실패 시 롤백
    setComments(prev);
    const s = e?.response?.status;
    if (s === 401) { alert("로그인이 필요합니다."); navigate("/login"); }
    else if (s === 403) { alert("댓글 수정 권한이 없습니다."); }
    else if (s === 404) { alert("댓글이 존재하지 않습니다."); }
    else { alert("댓글 수정에 실패했어요."); }
    console.error("[댓글 수정 실패]", e);
  }
};


  // ===== 댓글 삭제 =====
  const handleDeleteComment = async (cid) => {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    const rid = Number(id);
    try {
      await deleteRoadmapComment(rid, cid);
      setComments(prev => prev.filter(c => c.commentId !== cid));
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401) { alert("로그인이 필요합니다."); navigate("/login"); }
      else if (s === 403) { alert("댓글 삭제 권한이 없습니다."); }
      else if (s === 404) { alert("이미 삭제되었거나 존재하지 않습니다."); }
      else { alert("댓글 삭제에 실패했어요."); }
      console.error("[댓글 삭제 실패]", e);
    }
  };

  return (
    <>
      <TopHeader
        nickname={nickname}
        onLogoClick={() =>
          navigate("/", {
            state: { updatedId: Number(id), likeCount, bookmarkCount },
          })
        }
      />
      <Container>
        <ContainerButton>
          {roadmap && Number(localStorage.getItem("userId")) === Number(roadmap.authorId) && (
            <DeleteContainer>
              <UpdateButton onClick={() => navigate(`/edit/${id}`)}>수정</UpdateButton>
              <DeleteButton onClick={handleDeletePost}>삭제</DeleteButton>
            </DeleteContainer>
          )}
          <BookmarkButton
            onClick={bookmarkBusy ? undefined : handleBookmark}
            disabled={bookmarkBusy}
            style={{ opacity: bookmarkBusy ? 0.6 : 1 }}
          >
            {bookmark ? <FaBookmark /> : <FaRegBookmark />} {bookmarkBusy ? "처리중..." : "북마크"}
          </BookmarkButton>
        </ContainerButton>

        {roadmap && (
          <AllContainer>
            <Title>{roadmap.title}</Title>
            <CategoryPath>{catMap?.get(String(roadmap.category)) ?? String(roadmap.category)}</CategoryPath>
            <Description>{roadmap.description}</Description>
            <Author>작성자: {roadmap.authorNickname}</Author>
            <p>좋아요: {likeCount}, 북마크: {bookmarkCount}</p>
          </AllContainer>
        )}

        <LikeContainer
          onClick={likeBusy ? undefined : handleLike}
          style={{ opacity: likeBusy ? 0.6 : 1 }}
        >
          {likeState ? <FaHeart /> : <FaRegHeart />}
          <span style={{ marginLeft: 8 }}>{likeBusy ? "처리중..." : "좋아요"}</span>
        </LikeContainer>

        {/* 레벨/스텝 */}
        <LevelsContainer>
          {sections.map((sec) => (
            <LevelBlock key={sec.sectionId}>
              <LevelTitle>Lv.{sec.sectionNum} {sec.title}</LevelTitle>
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

        {/* 댓글 */}
        <BottomContainer>
          <CommentContainer>
            <CommentInput
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <CommentButton onClick={handleCreateComment}>등록</CommentButton>
          </CommentContainer>

       <CommentList>
  {comments.map((c) => {
    // ⚠️ 여기서 변수 선언 가능 (중괄호 블록)
    const mine = Number(c.authorId) === Number(localStorage.getItem("userId"));
    const isEditing = editingId === c.commentId;

    // 반드시 return 으로 JSX 반환
    return (
      <CommentDetail key={c.commentId}>
        <CommentText>
          <CommentName>
            {c.authorNickname}
            <span style={{ marginLeft: 8, color: "#999", fontWeight: 400 }}>
              {new Date(c.createdAt).toLocaleString()}
              {c.updatedAt && " (수정됨)"}
            </span>
          </CommentName>

          {!isEditing ? (
            <span>{c.content}</span>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <CommentInput
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                placeholder="댓글 수정..."
              />
              <CommentButton onClick={submitEdit}>수정</CommentButton>
              <CommentButton onClick={cancelEdit} style={{ backgroundColor: "#aaa" }}>
                취소
              </CommentButton>
            </div>
          )}

         <Actions>
  {/* 댓글 좋아요 버튼 */}
  <GhostButton
    onClick={() => handleToggleCommentLike(c.commentId, c.likedByMe)}
  >
    {c.likedByMe ? <FaHeart color="red" /> : <FaRegHeart />} {c.likeCount ?? 0}
  </GhostButton>

  {mine && !isEditing && (
    <>
      <GhostButton onClick={() => startEdit(c)}>
        <FaEdit /> 수정
      </GhostButton>
      <DangerButton onClick={() => handleDeleteComment(c.commentId)}>
        <FaTrash /> 삭제
      </DangerButton>
    </>
  )}

  {/* 대댓글 버튼 */}
  <GhostButton onClick={() => setReplyTarget(c.commentId)}>답글</GhostButton>
</Actions>


          {/* 대댓글 입력창 */}
          {replyTarget === c.commentId && (
            <ReplyContainer>
              <CommentInput
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="답글을 입력하세요..."
              />
              <CommentButton onClick={() => handleCreateReply(c.commentId)}>
                등록
              </CommentButton>
            </ReplyContainer>
          )}

          {/* 대댓글 목록 */}
          {!!c.replies?.length &&
            c.replies.map((r) => (
              <ReplyItem key={r.commentId}>
                <ReplyName>{r.authorNickname}</ReplyName>
                <ReplyText>{r.content}</ReplyText>
              </ReplyItem>
            ))}
        </CommentText>
      </CommentDetail>
    );
  })}
</CommentList>


        </BottomContainer>
      </Container>
    </>
  );
}

export default RoadmapDetail;