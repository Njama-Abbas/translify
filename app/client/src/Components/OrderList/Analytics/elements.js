import styled from "styled-components";
import Grid from "@material-ui/core/Grid";

export const Wrapper = styled(Grid)`
  background-color: rgba(0, 0, 0, 0.7);
  margin-top: 10px;
  height: 150px;
  width: 200px;
  cursor: pointer;
`;

export const CounterElemement = styled.div`
  border-radius: 50%;
  background-color: #ddd;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #0d1117;
  }
  &:hover > p {
    color: #ddd;
  }
`;

export const CounterNumber = styled.p`
  color: #0d1117;
  font-size: 2em;
  font-weight: 700;
  letter-spacing: 4px;
`;

export const CounterLabel = styled.p`
  margin-top: 2px;
  width: 100%;
  font-size: 1.4em;
  padding: 4px;
  color: #ddd;
  border: 1px solid #ddd;
`;
