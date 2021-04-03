import styled from "styled-components";
import { Paper } from "@material-ui/core";

export const OrderCardContainer = styled.div`
  width: 100%;
  padding: 8px;
`;

export const OrderCardHeader = styled.p`
  font-size: 2.5em;
  font-weight: 500;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 8px;
  width: 100%;
  text-align: center;
  margin-top: 64px;
`;

export const OrdersNav = styled(Paper)`
  width: 100%;
  padding: 8px 4px;
  background-color: rgba(0, 0, 0, 0) !important;
  display: Grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  row-gap: 8px;

  @media (max-width: 600px) {
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    column-gap: 4px;
  }
`;

export const FilterControlItem = styled.div`
  background-color: ${({ selected }) =>
    selected ? "rgba(0, 0,0, 0.7)" : "#3f51b5"};
  display: grid;
  cursor: pointer;
  grid-template-columns: 25% 50% 25%;
  justify-content: space-evenly;
  column-gap: 10px;
  align-items: center;
  height: 50px;
  border-radius: 10px;
  border-left: ${({ selected }) => (selected ? "1px solid blue" : "none")};
  border-right: ${({ selected }) => (selected ? "1px solid blue" : "none")};

  &:hover {
    background-color: #0d1117 !important;
  }
  @media (max-width: 600px) {
    grid-template-columns: auto auto auto;
    justify-content: center;
  }
`;

export const FilterText = styled.p`
  color: #fff;
  font-size: 1.7em;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 1em;
  }
`;

export const FilterIcon = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FilterCount = styled.p`
  background-color: #fff;
  height: 40px;
  color: #3f51b5;
  border-radius: 50%;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 1.5em;

  @media (max-width: 600px) {
    font-size: 1.2em;
    width: 24px;
    height: 25px;
  }
`;
export const Notification = styled(Paper)`
  background-color: rgba(0, 0, 0, 0.7) !important;
  width: 100%;
  height: 300px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Message = styled.p`
  font-size: 2.5em;
  font-weight: 500;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 8px;
  width: 100%;
  text-align: center;
`;
