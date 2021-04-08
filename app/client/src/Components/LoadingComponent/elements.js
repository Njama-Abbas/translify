import styled, { keyframes } from "styled-components";

export const LoadingPage = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(1, 1, 54, 0.979);
`;

export const LoadingText = styled.p`
  font-size: 2em;
  font-weight: 500;
  font-style: italic;
  color: #ddd;
`;

export const LoaderContainer = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  position: relative;
`;

const bouncer = keyframes`
 from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-100px);
  }
`;
export const SpinnerItem = styled.div`
  width: 30px;
  height: 30px;
  background-color: yellow;
  border-radius: 50%;
  animation: ${bouncer} 0.6s cubic-bezier(0.19, 0.57, 0.3, 0.98) infinite
    alternate;
  animation-delay: ${({ index }) =>
    index === "two"
      ? "0.1s"
      : index === "three"
      ? "0.2s"
      : index === "four"
      ? "0.3s"
      : index === "five"
      ? "0.4s"
      : "0"};
  opacity: ${({ index }) =>
    index === "two"
      ? 0.6
      : index === "three"
      ? 0.8
      : index === "four"
      ? 0.6
      : index === "five"
      ? 1
      : 1};
`;
