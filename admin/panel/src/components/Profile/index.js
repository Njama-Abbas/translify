import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import PersonalActions from "./components/PersonalActions";
import PersonalDetails from "./components/PersonalDetails";
import { AuthAPI } from "../../api";
import { Grid } from "@material-ui/core";
import { GreetingLine, ImageBgContainer } from "./profile.elements";
import CircularIndeterminate from "./Progress";

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
      setRedirect("/");
    }
    setCurrentUser(currentUser);
    setUserReady(true);
  }, []);

  let content;
  if (redirect) {
    content = <Redirect to={redirect} />;
  } else if (isLoading) {
    content = <CircularIndeterminate />;
  } else {
    content = (
      <div className="container">
        {userReady ? (
          <ImageBgContainer>
            <GreetingLine>
              Hello, &nbsp;{currentUser.firstname} &nbsp;
              {currentUser.lastname}
              <br />
              You are Admin
            </GreetingLine>
            <Grid
              container
              spacing={2}
              justify="center"
              alignContent="center"
              style={{
                height: "70%",
              }}
            >
              <PersonalDetails user={currentUser} setLoading={handleLoading} />
              <PersonalActions user={currentUser} />
            </Grid>
          </ImageBgContainer>
        ) : null}
      </div>
    );
  }
  return content;
}
