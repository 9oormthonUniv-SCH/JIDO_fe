
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 스타일 정의
const LogoText = styled.p`
  font-size:30px;
  font-weight:bold;
  color:black;
  margin:0;
  cursor:pointer;
`;

function Logo() {
  const navigate = useNavigate();

  return (
  <LogoText onClick={() => navigate("/")}>JIDO</LogoText>
);
}

export default Logo;
