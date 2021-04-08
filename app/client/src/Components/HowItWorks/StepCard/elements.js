import styled from "styled-components";

export const StepCardContainer = styled.div`
  width: 250px;
  height: 250px;
  background-color: #fff;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgba(13, 17, 23, 0.746);
  }
  &:hover > p {
    color: #fff;
  }
`;

export const CardNumber = styled.p`
  font-size: 6em;
  color: navy;
  text-align: center;
`;

export const CardContent = styled.p`
  font-size: 1.5em;
  text-align: center;
  color: #0d1117;
  font-weight: 500;
  text-shadow: 1px 1px 0.5px #2e2e2e;
`;
