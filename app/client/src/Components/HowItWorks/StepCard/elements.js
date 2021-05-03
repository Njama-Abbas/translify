import styled from "styled-components";

export const StepCardContainer = styled.div`
  width: 300px;
  height: 280px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1);
  background-color: #ddd;
  border-radius: 8px;
  padding: 8px;
  margin: 20px auto;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: scale(1.1);
  }
`;

export const CardNumber = styled.p`
  font-size: 4em;
  color: navy;
  text-align: center;
`;

export const CardContent = styled.p`
  font-size: 1.5em;
  text-align: center;
  color: #000916;
  font-weight: 600;
`;
