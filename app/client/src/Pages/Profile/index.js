import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  PersonalDetails,
  PersonalActions,
  ProfilePhoto,
  LoadingComponent,
} from "../../Components";
import { AuthAPI } from "../../Api";
import { ImageBgContainer } from "../../Resources/Styles/global";
import { Grid } from "@material-ui/core";
import { GreetingLine } from "./profile.elements";

export default function Profile() {
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoading = (state) => {
    setIsLoading(state);
  };

  useEffect(() => {
    const currentUser = AuthAPI.getCurrentUser();

    if (!currentUser) {
      setRedirect("/home");
    }
    setCurrentUser(currentUser);
    setUserReady(true);
  }, []);

  let content;
  if (redirect) {
    content = <Redirect to={redirect} />;
  } else if (isLoading) {
    content = <LoadingComponent message={"updating details..."} />;
  } else {
    content = (
      <div className="container">
        {userReady ? (
          <ImageBgContainer>
            <GreetingLine>
              Hello, &nbsp;{currentUser.firstname} &nbsp;
              {currentUser.lastname}
            </GreetingLine>
            <Grid container spacing={2} justify="center" alignContent="center">
              <Grid item md={6} sm={12}>
                <ProfilePhoto />
              </Grid>
              <Grid item md={6} sm={12}>
                <Grid container spacing={2} justify="center" direction="column">
                  <PersonalDetails
                    user={currentUser}
                    setLoading={handleLoading}
                  />
                  <PersonalActions user={currentUser} />
                </Grid>
              </Grid>
            </Grid>
          </ImageBgContainer>
        ) : null}
      </div>
    );
  }
  return content;
}
