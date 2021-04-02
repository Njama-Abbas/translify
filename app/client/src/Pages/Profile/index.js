import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { PersonalDetails, PersonalActions } from "../../Components";
import { AuthAPI } from "../../Api";
import { ImageBgContainer } from "../../Resources/Styles/global";
import { Grid } from "@material-ui/core";
import {
  GreetingLine,
  ProfileImage,
  ProfileImageWrapper,
} from "./profile.elements";
import DefaultProfileImage from "../../Resources/Images/undraw_profile_pic.svg";
export default function Profile() {
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const currentUser = AuthAPI.getCurrentUser();

    if (!currentUser) {
      setRedirect("/home");
    }
    setCurrentUser(currentUser);
    setUserReady(true);
  }, []);

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div className="container">
      {userReady ? (
        <ImageBgContainer>
          <GreetingLine>
            {/**to be determined by current time */}
            Greetings&nbsp;&nbsp;{currentUser.firstname}
          </GreetingLine>
          <ProfileImageWrapper>
            <ProfileImage src={DefaultProfileImage} />
          </ProfileImageWrapper>
          <Grid container spacing={2} justify="center">
            <PersonalDetails user={currentUser} />
            <PersonalActions user={currentUser} />
          </Grid>
        </ImageBgContainer>
      ) : null}
    </div>
  );
}
