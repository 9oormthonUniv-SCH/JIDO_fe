
import styled from "styled-components";
import Home from "./Home";
import welcomeImage from "../assets/Pi.png";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const WelcomeSection = styled.section`
  height: 100vh; /* 화면 꽉 차게 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  background-color: #fafdfb;
`;

const Text = styled.div`
  font-size: 28px;
  font-weight: bold;
`;

const Image = styled.img`
  width: 50%;
  border-radius: 20px;
`;

const HomeSection = styled.section`
  min-height: 100vh;
  background: white;
  padding-top: 40px;
`;

function WelcomePage() {
  return (
    <Wrapper>
      <WelcomeSection>
        <Text>JiDO는 당신의 목적지까지 함께합니다</Text>
        <Image src={welcomeImage} alt="traveler" />
      </WelcomeSection>

      <HomeSection>
        <Home /> {/* 기존 Home 컴포넌트 전체 */}
      </HomeSection>
    </Wrapper>
  );
}

export default WelcomePage;
