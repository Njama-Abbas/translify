import styled from "styled-components";
import { Container as C } from "../../Resources/Styles/global";
export const Container = styled(C)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const SectionHeading = styled.p`
  font-size: 3em;
  text-transform: uppercase;
  padding: 4px 8px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 15px;
`;
export const ColumnHeader = styled.p`
  font-size: 2em;
  text-transform: uppercase;
  padding: 4px 8px;
  margin-top: 10px;
  margin-bottom: 15px;
`;

export const TextContent = styled.div`
  font-size: 1.2em;
  > p {
    padding: 8px;
  }
`;
