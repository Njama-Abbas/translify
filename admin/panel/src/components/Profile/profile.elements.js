import styled from "styled-components";
import { Paper, Avatar } from "@material-ui/core";
import bgImage from "../../Resources/Images/keppel-port.jpg";
export const GreetingLine = styled.p`
  font-size: 42px;
  line-height: 48px;
  text-align: center;
  text-transform: capitalize;
  color: #ddd;
  padding: 8px;
  background-color: rgba(15, 0, 6, 0.527);
  border-radius: 20px;
`;
export const ImageBgContainer = styled.div`
  background-image: url(${bgImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #fff;
  height: 88vh;
  padding-left: 30px;
  padding-right: 30px;
`;

export const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ProfileSectionHeader = styled.p`
  font-size: 1.7rem;
  color: #810101;
  text-align: center;
  line-height: 40px;
  font-weight: 500;
  text-transform: uppercase;
`;

export const PersonalDetailsItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2em;
  border: 1px solid rgba(231, 218, 218, 0.87);
  background: rgba(231, 218, 218, 0.87);
  border-radius: 5px;
  padding: 8px 4px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const FormPaper = styled(Paper)`
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Form = styled.form`
  width: 100%;
`;

export const FormAvatar = styled(Avatar)`
  background-color: #f48fb1;
  margin: 8px;
`;

export const AccountBalance = styled.p`
  margin: auto;
  border-radius: 10px;
  background-color: #0d1117;
  color: #ddd;
  text-align: center;
  padding: 8px 16px;
  font-size: 1.5em;
  margin-bottom: 10px;
  width: fit-content;
  box-shadow: 1px 1px 5px #fff;
`;

export const Money = styled.span`
  font-size: 1.5em;
  letter-spacing: 3px;
  font-weight: 800;
  color: #ddd;
`;
