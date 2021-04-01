import styled from "styled-components";

export const DriverListContainer = styled.div`
  margin-top: 20px;
`;

export const DriverListHeader = styled.p`
  font-weight: 700;
  background-color: #0d1117;
  color: #fff;
  text-align: center;
  word-wrap: wrap;
  font-size: 2em;
`;
export const DriverListItems = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  justify-content: center;

  @media (max-width: 620px) {
    grid-template-columns: auto;
    grid-template-rows: auto;
  }
`;

export const ErrorNotification = styled.p`
  font-weight: 1.5em;
  background-color: #fff;
  color: red;
`;
