import styled from "styled-components";
import { Paper } from "@material-ui/core";

export const OrderDetailsContainer = styled(Paper)`
  padding: 4px 8px;
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  @media (max-width: 600px) {
    width: 300px;
  }
`;

export const OrderDetailsHeader = styled.p`
  font-size: 2.5em;
  font-weight: 700;
  color: #0d1117;
  border-bottom: 1px solid currentColor;
  padding: 4px;
  width: 100%;
  text-align: center;
`;

export const OrderColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

export const OrderItem = styled.p`
  font-weight: 500;
  width: 50%;
  font-weight: 600;
  font-size: 1.3em;
  text-transform: capitalize;
  color: #0d1117;
  padding: 4px;
  margin: 4px;
  @media (max-width: 600px) {
    font-size: 1em;
  }
`;

export const OrderValue = styled.p`
  font-size: 1.3em;
  width: 50%;
  color: navy;
  padding: 4px;
  margin: 4px;
  border-bottom: 2px solid navy;
  font-weight: 300;
  word-wrap: wrap;
  word-break: break-word;
  @media (max-width: 600px) {
    font-size: 1em;
  }
`;

export const OrderStatus = styled(OrderValue)`
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 3px;
  font-weight: 500;
`;
