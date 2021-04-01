import styled from "styled-components";
import { Paper } from "@material-ui/core";

export const InfoPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CardHeader = styled.p`
  font-size: 2em;
  text-align: center;
  color: navy;
  border-radius: 10px;
  border-bottom: 5px solid navy;
  margin-bottom: 10px;
`;

export const OrderInfoWraper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  padding: 8px 2px;
  border-bottom: 1px solid navy;
`;
export const OrderInfoLabel = styled.p`
  font-size: 1.5em;
  font-weight: 700;
  color: navy;
`;

export const OrderInfoItem = styled.p`
  font-size: 1.2em;
  font-weight: 300;
  text-align: right;
  overflow: wrap;
  color: ${({ colored }) => (colored ? "navy" : "#0d1117")};
  word-break: break-all;
`;
