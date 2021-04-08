import styled from "styled-components";
import { Container as C } from "../../Resources/Styles/global";

export const Container = styled(C)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 100%;
  grid-gap: 10px;

  @media (max-width: 799px) {
    grid-template-columns: auto auto;
    grid-template-rows: auto;
  }

  @media (max-width: 549px) {
    grid-template-columns: auto;
    grid-template-rows: auto;
  }
`;
export const CardHeder = styled.p`
  text-align: center;
  font-size: 4em;
  text-transform: capitalize;
  text-shadow: 1px 1px 1px white;
  color: navy;
  border-bottom: 2px double black;
  margin-bottom: 10px;
`;
