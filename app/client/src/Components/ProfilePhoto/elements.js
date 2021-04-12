import { Paper } from "@material-ui/core";
import styled from "styled-components";
import { Button } from "../../Resources/Styles/global";

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;
`;

export const FormPaper = styled(Paper)`
  width: 300px;
`;
export const Wrapper = styled.div`
  position: relative;
`;

export const ProfileImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 50%;

  @media (max-width: 600px) {
    width: 150px;
    height: 150px;
  }
`;

export const FileInput = styled.input`
  width: 90%;
  margin: 4px 8px;

  &::-webkit-file-upload-button {
    visibility: hidden;
  }

  &::before {
    content: "Choose Image";
    display: inline-block;
    background: linear-gradient(top, #f9f9f9, #e3e3e3);
    border: 1px solid #999;
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
  }

  &:hover::before {
    border-color: black;
  }

  &:active::before {
    background: linear-gradient(top, #e3e3e3, #f9f9f9);
  }
`;

export const EditButton = styled(Button)`
  position: absolute;
  right: 10px;
  bottom: 10px;

  @media (max-width: 600px) {
    right: 2px;
    bottom: 2px;
  }
`;

export const ProfileControls = styled.div`
  width: 80%;
  margin: 5px auto;
  display: flex;
  justify-content: center;
`;
