import styled from "styled-components";

export const GreetingLine = styled.h3`
  font-size: 42px;
  line-height: 48px;
  text-align: center;
  text-transform: capitalize;
  color: #810101;
  padding: 8px;
`;

export const ProfileImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 50%;

  @media (max-width: 600px) {
    width: 150px;
    height: 150px;
  }
`;

export const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
`;
