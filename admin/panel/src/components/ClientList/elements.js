import styled from "styled-components";
import ListItem from "@material-ui/core/ListItem";

export const ListColum = styled.p`
  font-weight: 400;
  text-transform: uppercase;
  color: blue;
  border-left: 1px solid blue;
  padding-left: 5px;
`;

export const ListRow = styled(ListItem)`
  min-width: 100%;
  display: grid;
  grid-template-columns: repeat(${({ cols }) => (cols ? cols : 7)}, 1fr);
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid black;
  &:hover {
    background-color: #ddd;
  }
`;

export const DataItem = styled.p`
  text-align: left;
  padding-left: 5px;
`;
