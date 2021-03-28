import styled from "styled-components";
import Grid from "@material-ui/core/Grid";

export const ProgressContainer = styled(Grid)`
  height: 100vh;
  background-color: #000414;
`;

export const ProgessWrappper = styled(Grid)`
  width: 80%;
  display: flex;
  justify-content: center;
`;

export const ProgressText = styled.p`
  font-size: 2em;
  color: #ddd;
  text-align: center;
`;
