import styled from "styled-components";

export const DriverItem = styled.div`
  padding: 4px 8px;
  background-color: ${({ designated }) =>
    designated ? "navy" : "rgba(8, 0, 0, 0.829)"};
  margin: 2px 4px;
  color: #fff;
  max-width: 300px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0231a7;
  }
`;
export const DriverItemWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  justify-content: start;
  align-items: center;
  margin-bottom: 10px;
`;

export const DriverProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border: 1px solid #fff;
  border-radius: 50%;
`;

export const DriverDetails = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto;
  font-weight: 500;
  font-size: 1.2em;
`;
