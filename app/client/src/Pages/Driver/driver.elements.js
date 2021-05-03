import styled from "styled-components";
import { Grid } from "@material-ui/core";
import { IoAlertCircle } from "react-icons/io5";

export const Box = styled(Grid)`
  background: url("https://i.postimg.cc/DZqKmp8k/highway-truck.jpg");
  background-size: cover;
  min-height: 100vh;
  background-position: center;
  background-attachment: fixed;
`;

export const PageContainer = styled(Grid)`
  height: 100vh;
  width: 100%;
  background-color: #ddd;
`;

export const MessageWrapper = styled(Grid)`
  height: 50vh;
  width: 600px;
  border-radius: 5px;
  text-align: center;
  padding-bottom: 10px;
  background-color: rgba(253, 233, 233, 0.849);
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);

  @media (max-width: 600px) {
    max-height: 80vh;
    width: 100%;
  }
`;

export const AlertIcon = styled(IoAlertCircle)`
  padding: 10px;
  height: 100px;
  width: 300px;

  @media (max-width: 400px) {
    height: 50px;
    width: 200px;
  }
`;

export const Message = styled.p`
  font-weight: 300;
  font-size: 25px;
  padding: 0 4px;
  color: #0d1117;
  text-align: center;

  @media (max-width: 1160px) {
    font-size: 24px;
    letter-spacing: 2px;
  }
`;
