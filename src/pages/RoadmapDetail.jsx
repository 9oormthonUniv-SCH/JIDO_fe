import styled from "styled-components";

import TopHeader from "../components/TopHeader";
import {useEffect,useState} from 'react';

const Container=styled.div`
  display:flex;
  flex-direction:column;
  gap:10px;  
  align-items:center;
  justify-content:center;
  margin-top:100px;

`

const AllContainer=styled.div`
    width:600px;
    background:#f2f2f2;
    border-radius:30px;
    border:none;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
   height:auto;



`;

const Title=styled.p`
  font-weight:bold;
  font-size:20px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0;


`;

const Description=styled.p`
   font-size:13px;
   display:flex;
  align-items:center;
  justify-content:center;
  margin:0;
  margin-top:10px;
 



`;

const Author=styled.p`
  font-size:13px;
   display:flex;
  align-items:center;
  justify-content:center;
  margin:0px;
   margin-top:10px;
`;
//댓글이랑 좋아요 컴포넌트
const BottomContainer=styled.div`
   display:flex;
   flex-direction:column;
   margin-top:20px;
   width:600px;

`;

const LikeContainer=styled.div`
   display:flex;
   margin-right:auto;
   font-size:13px;
   cursor:pointer;

`;
//입력창 컨테이너
const CommentContainer=styled.div`
    display:flex;
    margin-top:20px;
   gap:10px;


`;

const CommentInput=styled.input`
    flex:1;

`;

//댓글 목록 컨테이너
const CommentList=styled.div`
    display:flex;
    flex-direction:column;


`;

const CommentName=styled.p`
    font-weight:bold;
    font-size:13px;
    margin:0px;
`;

const CommentDetail = styled.p`
  display: flex;
  gap: 8px;
  font-size: 13px;
`;



const CommentButton=styled.button`
   border-radius:10px;
   background-color:gray;
   display:flex;
   margin-left:auto;
   border:none;
   width:50px;
   height:25px;
   font-size:12px;
   align-items:center;
    justify-content:center;
    cursor:pointer;
  font-weight:bold;


`;


function RoadmapDetail(){
    const [nickname,setNickname]=useState("");
    const [likeState,setLikeState]=useState(false);
    const [comments,setComments]=useState([]);
    const [commentState,setCommentState]=useState("");
    const [bookMark,setBookMark]=useState(false);
    
    useEffect(()=>{const stored=localStorage.getItem("nickname");
                 if(stored) {setNickname(stored)}
    },[]);

    const handleLike=()=>{setLikeState(prev=>!prev);};

    const handleComment=()=>{if(commentState.trim()=="")return;
        setComments(prev=>[...prev,{user:nickname||"익명",text:commentState}]);
        setCommentState("");
    };

    return(
     <Container>
        <TopHeader nickname={nickname}/>
  
        <AllContainer>
            <Title>로드맵 제목</Title>
            <Author>작성자:{nickname}</Author>
            <Description>이건 설명이야</Description>
            
        </AllContainer>
        <BottomContainer>
            <LikeContainer onClick={handleLike}>{likeState ? "♥ 좋아요":"♡ 좋아요"}</LikeContainer>
            <CommentContainer>
              <CommentInput type="text" placeholder="댓글을 입력해주세요"
                value={commentState} onChange={(e) => setCommentState(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") {  e.preventDefault(); handleComment();
    }
  }}
/>

                <CommentButton onClick={handleComment}>입력</CommentButton>
            </CommentContainer>

         <CommentList>
            {comments.map((comment, idx) => (
           <CommentDetail key={idx}>
           <CommentName>{comment.user}</CommentName>
           {comment.text}
    </CommentDetail>
  ))}
</CommentList>

        </BottomContainer>
    </Container>

    );
}

export default RoadmapDetail;
