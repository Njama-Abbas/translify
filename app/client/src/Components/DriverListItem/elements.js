import styled from "styled-components";
export const DriverContainer = styled.div`
  padding: 4px 8px;
  letter-spacing: 3px;
  background-color: rgba(250, 248, 248, 0.945);
  color: #0d1117;
  margin: 5px;
  width: 400px;
`;
export const DriverItemBox = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  margin-bottom: 10px;
`;
export const ProfileImage = styled.img`
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
