import styled from "styled-components";
import PI from "../../assets/PI.png";

const WelcomeWrapper = styled.div`
  width: 100%;
  height: 350px;
  background-image: url(${PI});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WelcomeText = styled.div`
  font-size: 32px;
  font-weight: bold;
  line-height: 1.5;
  color: white;
  text-align: center;
  span {
    color: #b4e0b4;
  }
`;

function WelcomeSection() {
  return (
    <WelcomeWrapper>
      <WelcomeText>
        JIDO는 당신의 목표까지 함께합니다.
        <br />
        <span>지금 바로 시작해보세요!</span>
      </WelcomeText>
    </WelcomeWrapper>
  );
}

export default WelcomeSection;
