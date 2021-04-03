import styled from "styled-components";
import { Paper } from "@material-ui/core";

export const OrderContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.7) !important;
  margin: 3px 5px;
  cursor: pointer;
  padding: 4px 16px;
  width: 100%;
  &:hover {
    background-color: #0d1117 !important;
  }
`;

export const OrderItemHeader = styled.p`
  font-weight: 600;
  color: #fff;
  font-size: 1.3rem;
`;

export const OrderItemRow = styled.p`
  letter-spacing: 2px;
  color: #ddd;
  font-weight: 300;
  font-style: italic;
`;
