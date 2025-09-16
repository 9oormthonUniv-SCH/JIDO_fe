// src/pages/RoadmapDetail.jsx
import styled from "styled-components";
import TopHeader from "../components/TopHeader";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaTrash, FaBookmark, FaRegBookmark, FaEdit } from "react-icons/fa";
import {
  getRoadmapDetail,
  listCategories,
  deleteRoadmap,
  listRoadmapComments,
  createRoadmapComment,
  updateRoadmapComment,
  deleteRoadmapComment,
  addCommentLike,
  removeCommentLike
} from "../api/roadmap";
import {
  addLike,
  removeLike,
  addBookmark,
  removeBookmark,
  fetchLikeStatus,
  fetchBookmarkStatus
} from "../api/roadmapLike";

/* =========================
   styled-components (원본 그대로)
========================= */
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
`;

const ContainerButton = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 900px;
  padding: 0 20px;
  margin-top: 8px;
`;

const DeleteContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`;

const BookmarkButton = styled.button`
  background-color: #fafdfb;
  color: #2e5c4d;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  font-weight: bold;
  margin-left: 20px;
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
  &:hover { background-color: #d32f2f; }
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
  &:hover { background-color: #1976d2; }
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

/* 댓글 입력창 */
const CommentContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const CommentInput = styled.input`
  flex: 1;
  height: 42px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1.5px solid #e0e6e3;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    border-color: #2e5c4d;
    box-shadow: 0 0 0 3px rgba(46, 92, 77, 0.15);
    outline: none;
  }
`;

const CommentButton = styled.button`
  border-radius: 8px;
  background-color: #2e5c4d;
  color: white;
  font-weight: 600;
  border: none;
  padding: 0 14px;
  height: 42px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background-color: #24493d; }
`;

/* 댓글 리스트 */
const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 10px;
`;

/* 댓글 아이템 */
const CommentDetail = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const CommentImg = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
`;

/* 댓글 본문 */
const CommentText = styled.div`
  flex: 1;
  background: #fff;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CommentName = styled.span`
  font-weight: 600;
  font-size: 13px;
  color: #2e5c4d;
`;

const CommentContent = styled.span`
  font-size: 14px;
  color: #333;
  line-height: 1.4;
`;



/* 대댓글 */
const ReplyContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 8px 0 0 50px;
`;

const ReplyItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  background: #f9faf9;
  border: 1px solid #e4e7e6;
  border-radius: 8px;
  padding: 10px 12px;
  gap: 6px;
`;

const ReplyName = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: #2e5c4d;
`;

const ReplyText = styled.span`
  font-size: 13px;
  color: #444;
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
/* 액션 버튼 */
const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
  font-size: 12px;
  color: #666;
  button {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 6px;
    transition: background 0.15s;
    &:hover {
      background: #f0f3f2;
      color: #2e5c4d;
    }
  }
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
  &:hover { background: #eef3f1; color: #2e5c4d; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const DangerButton = styled(GhostButton)`
  color: #c62828;
  &:hover { background: #fdecea; color: #b71c1c; }
`;

/* =========================
   로컬 parent 매핑 저장 유틸
========================= */
const STORAGE_KEY = (rid) => `replyParentMap:${rid}`;
const loadParentMap = (rid) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(rid));
    if (!raw) return new Map();
    const obj = JSON.parse(raw);
    return new Map(Object.entries(obj).map(([k, v]) => [Number(k), Number(v)]));
  } catch {
    return new Map();
  }
};
const saveParentMap = (rid, map) => {
  try {
    const obj = Object.fromEntries([...map.entries()]);
    localStorage.setItem(STORAGE_KEY(rid), JSON.stringify(obj));
  } catch {}
};

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

  // 답글 입력(전역 상태: 어떤 댓글에 답글 쓰는지)
  const [replyTexts, setReplyTexts] = useState({});
const [replyTarget, setReplyTarget] = useState(null);

const handleChangeReply = (cid, value) => {
  setReplyTexts((prev) => ({ ...prev, [cid]: value }));
};
  // busy flags
  const [loading, setLoading] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 카테고리 path 표시
  const [catMap, setCatMap] = useState(null);

  // (중요) childId -> parentId 로컬 매핑
  const parentMapRef = useRef(new Map());

  /* ---------- 유틸: 카테고리 path ---------- */
  const buildIdToPathLabel = (cats) => {
    const byId = new Map(cats.map((c) => [String(c.categoryId), c]));
    const idToPath = new Map();
    cats.forEach((c) => {
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

  /* ---------- 댓글: 항상 올바른 트리로 보정(로컬 parent 매핑 반영) ---------- */
  function ensureCommentTree(raw) {
    const parentMap = parentMapRef.current;

    // 1) 전체 평탄화(replies 안쪽까지)
    const flat = [];
    const walk = (arr, inferredParentId = null) => {
      for (const it of arr || []) {
        const idNum = Number(it.commentId);
        const explicitParent =
          it.parentId !== undefined && it.parentId !== null
            ? Number(it.parentId)
            : null;
        const mappedParent = parentMap.get(idNum) ?? null;
        // 서버가 parentId를 안 주거나 루트로 섞여 내려보내는 경우를 대비:
        const effectiveParent =
          explicitParent ?? mappedParent ?? inferredParentId;

        const node = {
          ...it,
          commentId: idNum,
          parentId: effectiveParent,
          replies: Array.isArray(it.replies) ? it.replies : [],
        };
        flat.push({ ...node, replies: [] });
        walk(node.replies, node.commentId); // 중첩 응답이면 재귀 추론
      }
    };
    walk(Array.isArray(raw) ? raw : [], null);

    // 2) parentId 기준 재조립
    const byId = new Map(flat.map((n) => [n.commentId, { ...n, replies: [] }]));
    const roots = [];
    for (const n of byId.values()) {
      if (n.parentId && byId.has(n.parentId)) {
        byId.get(n.parentId).replies.push(n);
      } else {
        roots.push(n);
      }
    }

    // 3) 최신순 정렬(루트/자식 각각)
    const safeTime = (x) => (x?.createdAt ? new Date(x.createdAt).getTime() : 0);
    const sortDesc = (arr) => {
      arr.sort((a, b) => safeTime(b) - safeTime(a));
      arr.forEach((x) => x.replies && sortDesc(x.replies));
    };
    sortDesc(roots);
    return roots;
  }

  /* ---------- 댓글 트리 편집 유틸(낙관적 갱신용) ---------- */
  const updateCommentInTree = (list, targetId, updater) =>
    list.map((c) => {
      if (c.commentId === targetId) return updater(c);
      if (Array.isArray(c.replies) && c.replies.length) {
        return { ...c, replies: updateCommentInTree(c.replies, targetId, updater) };
      }
      return c;
    });

  const deleteCommentInTree = (list, targetId) =>
    list
      .filter((c) => c.commentId !== targetId)
      .map((c) => ({
        ...c,
        replies: c.replies ? deleteCommentInTree(c.replies, targetId) : [],
      }));

  /* ---------- 댓글 로딩 ---------- */
  const loadComments = async (rid) => {
    try {
      const raw = await listRoadmapComments(rid);
      setComments(ensureCommentTree(raw));
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401 || s === 403) {
        console.warn("댓글은 로그인 사용자만 조회 가능");
      } else {
        console.error("[댓글 조회 실패]", e);
      }
    }
  };

  /* ---------- 상세/좋아요/북마크/댓글 조회 ---------- */
  const fetchDetail = async (rid) => {
    setLoading(true);
    try {
      // 로컬 parentMap 먼저 로드
      parentMapRef.current = loadParentMap(rid);

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

      await loadComments(rid);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const rid = Number(id);
    fetchDetail(rid);
  }, [id]);

  /* ---------- 로드맵 삭제 ---------- */
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
        alert("로그인이 필요합니다.");
        navigate("/login");
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

  /* ---------- 댓글 좋아요 ---------- */
  const handleToggleCommentLike = async (commentId, liked) => {
    try {
      if (liked) await removeCommentLike(commentId);
      else await addCommentLike(commentId);

      setComments((prev) =>
        updateCommentInTree(prev, Number(commentId), (c) => ({
          ...c,
          likedByMe: !liked,
          likeCount: (c.likeCount ?? 0) + (liked ? -1 : 1),
        }))
      );
    } catch (e) {
      console.error("[댓글 좋아요 실패]", e);
      alert("댓글 좋아요 처리에 실패했습니다.");
    }
  };

  /* ---------- 로드맵 좋아요/북마크 ---------- */
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
      }
      console.error(e);
    } finally {
      setLikeBusy(false);
    }
  };

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
      }
      console.error(e);
    } finally {
      setBookmarkBusy(false);
    }
  };

  /* ---------- 댓글/대댓글 작성 ---------- */
  const handleCreateReply = async (parentId) => {
  const rid = Number(id);
  const content = (replyTexts[parentId] || "").trim();
  if (!content) return;

  try {
    const created = await createRoadmapComment(rid, content, parentId);
    if (created?.commentId) {
      parentMapRef.current.set(Number(created.commentId), Number(parentId));
      saveParentMap(rid, parentMapRef.current);
    }
    setReplyTexts((prev) => ({ ...prev, [parentId]: "" })); // 입력창만 초기화
    setReplyTarget(null);
    await loadComments(rid);
  } catch (e) {
    alert("대댓글 등록에 실패했어요.");
    console.error(e);
  }
};

  const handleCreateComment = async () => {
    const rid = Number(id);
    const content = newComment.trim();
    if (!content) return;

    try {
      await createRoadmapComment(rid, content, null);
      setNewComment("");
      await loadComments(rid);
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        alert("댓글 등록에 실패했어요.");
      }
      console.error("[댓글 등록 실패]", e);
    }
  };

  /* ---------- 댓글 수정/삭제 ---------- */
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

    try {
      await updateRoadmapComment(rid, cid, content);
      setEditingId(null);
      setEditingText("");
      await loadComments(rid);
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else if (s === 403) {
        alert("댓글 수정 권한이 없습니다.");
      } else if (s === 404) {
        alert("댓글이 존재하지 않습니다.");
      } else {
        alert("댓글 수정에 실패했어요.");
      }
      console.error("[댓글 수정 실패]", e);
    }
  };

  const handleDeleteComment = async (cid) => {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    const rid = Number(id);
    try {
      await deleteRoadmapComment(rid, cid);
      await loadComments(rid);
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else if (s === 403) {
        alert("댓글 삭제 권한이 없습니다.");
      } else if (s === 404) {
        alert("이미 삭제되었거나 존재하지 않습니다.");
      } else {
        alert("댓글 삭제에 실패했어요.");
      }
      console.error("[댓글 삭제 실패]", e);
    }
  };

  /* ---------- 재귀 렌더 ---------- */
  const ReplyNode = ({ node: c, depth = 0 }) => {
    const mine = Number(c.authorId) === myId;
    const isEditing = editingId === c.commentId;

      // ✅ 포커스 유지 ref
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (replyTarget === c.commentId && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyTarget, replyTexts[c.commentId]]);

    return (
      <div style={{ marginLeft: depth * 24 }}>
        <CommentDetail>
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
              <GhostButton onClick={() => handleToggleCommentLike(c.commentId, c.likedByMe)}>
                {c.likedByMe ? <FaHeart /> : <FaRegHeart />} {c.likeCount ?? 0}
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

              <GhostButton onClick={() => setReplyTarget(c.commentId)}>답글</GhostButton>
            </Actions>

       {replyTarget === c.commentId && (
  <ReplyContainer>
    <CommentInput
       ref={replyInputRef}
      value={replyTexts[c.commentId] || ""}
      onChange={(e) => handleChangeReply(c.commentId, e.target.value)}
      placeholder="답글을 입력하세요..."
    />
    <CommentButton onClick={() => handleCreateReply(c.commentId)}>등록</CommentButton>
  </ReplyContainer>
)}

            {!!c.replies?.length &&
              c.replies.map((child) => (
                <ReplyNode key={child.commentId} node={child} depth={depth + 1} />
              ))}
          </CommentText>
        </CommentDetail>
      </div>
    );
  };

  const Replies = ({ nodes }) => (
    <>
      {nodes.map((c) => (
        <ReplyNode key={c.commentId} node={c} depth={0} />
      ))}
    </>
  );

  /* ---------- 렌더 ---------- */
  return (
    <>
      <TopHeader
        nickname={nickname}
        onLogoClick={() => {
          navigate("/", {
            state: { updatedId: Number(id), likeCount, bookmarkCount },
          });
        }}
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
            <CategoryPath>
              {catMap?.get(String(roadmap.category)) ?? String(roadmap.category)}
            </CategoryPath>
            <Description>{roadmap.description}</Description>
            <Author>작성자: {roadmap.authorNickname}</Author>
            <p>좋아요: {likeCount}, 북마크: {bookmarkCount}</p>
          </AllContainer>
        )}

        <LikeContainer onClick={likeBusy ? undefined : handleLike} style={{ opacity: likeBusy ? 0.6 : 1 }}>
          {likeState ? <FaHeart /> : <FaRegHeart />}
          <span style={{ marginLeft: 8 }}>{likeBusy ? "처리중..." : "좋아요"}</span>
        </LikeContainer>

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
            <Replies nodes={comments} />
          </CommentList>
        </BottomContainer>
      </Container>
    </>
  );
}

export default RoadmapDetail;
