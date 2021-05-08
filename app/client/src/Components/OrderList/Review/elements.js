import styled from "styled-components";
import { Paper } from "@material-ui/core";

export const ReviewWrapper = styled(Paper)`
  max-width: 600px;
  padding: 16px 32px;
`;
export const ReviewHeader = styled.p`
  font-size: 1.5em;
  text-align: center;
  font-weight: 300;
  letter-spacing: 3px;
  margin: 8px auto;
`;

export const ReviewText = styled.p`
  font-size: 1.3em;
  position: absolute;
  right: 10%;
  text-align: right;
  font-weight: 300;
  letter-spacing: 3px;
  margin: 8px auto;
  color: #ccc;
`;
