import styled from "styled-components";
import { ListItem as LI } from "@material-ui/core";
import { Link } from "react-router-dom";

export const ListItem = styled(LI)`
  margin: 8px auto;
  font-weight: 300;
  display: flex;
`;

export const NavLink = styled(Link)`
  letter-spacing: 2px;
  font-size: 1.5em;
  text-decoration: none;
  text-transform: capitalize;
  display: flex;
  justify-content: space-between;
`;
