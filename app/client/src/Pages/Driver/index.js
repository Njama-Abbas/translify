import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import { Grid } from "@material-ui/core";
import { DriverAPI, UserAPI, AuthAPI } from "../../Api";

import destination from "../../Resources/Images/Destination.svg";
import { Container } from "../../Resources/Styles/global";
import { Box } from "./driver.elements";

import Profile from "../Profile";

import {
  Navbar,
  DriverRegistrationForm,
  Image,
  OrderList,
  Footer,
} from "../../Components";

export default function Driver() {
  const { addToast } = useToasts();
  const { path } = useRouteMatch();
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(null);
  const [user, setUser] = useState(undefined);
  const [approval_status, setApprovalStatus] = useState(null);

  useEffect(() => {
    const currentUser = AuthAPI.getCurrentUser();

    if (!currentUser) {
      setRedirect("/home");
    }

    UserAPI.getDriverBoard().then(
      (response) => {
        const { id } = response.data;
        setUser(response.data);
        setUserReady(true);
        DriverAPI.check_approval(id).then(
          (response) => {
            setApprovalStatus(response.data.approval_status);
          },
          (error) => {
            const { status } = error.response;
            if (status === 404) {
              setApprovalStatus(null);
              addToast(error.response.data.message, {
                appearance: "error",
              });
            }
          }
        );
      },
      (error) => {
        setUser(undefined);
        addToast(`An error occured ${error} `, {
          appearance: "error",
        });
      }
    );
  }, [addToast]);

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <Switch>
      <Route path={path} exact>
        <div>
          {userReady ? (
            <div>
              <Box container justify="space-between">
                <Container>
                  <Navbar />
                  {approval_status === "A" ? (
                    <OrderList user={user} />
                  ) : approval_status === "P" ? (
                    <p>Registration successful pending approval</p>
                  ) : approval_status === "D" ? (
                    <p>
                      We are Sorry that your approval request has been declined
                    </p>
                  ) : (
                    <Grid
                      container
                      spacing={2}
                      justify="center"
                      alignContent="center"
                    >
                      <Grid item xs={12} sm={6} md={6}>
                        <DriverRegistrationForm USER_ID={user.userId} />
                      </Grid>

                      <Grid item xs={12} sm={6} md={6}>
                        <Image
                          start="true"
                          alt="my current location"
                          src={destination}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Container>
              </Box>
              <Footer />
            </div>
          ) : null}
        </div>
      </Route>
      <Route path={`${path}/notifications`}>
        <div>Comming soon</div>
      </Route>
      <Route path={`${path}/profile`}>
        <Profile />
      </Route>
    </Switch>
  );
}
