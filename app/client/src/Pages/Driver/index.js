import React, { useState, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import { Grid } from "@material-ui/core";
import { DriverAPI, UserAPI, AuthAPI } from "../../Api";

import { Container, LinkButton } from "../../Resources/Styles/global";
import {
  AlertIcon,
  Box,
  Message,
  MessageWrapper,
  PageContainer,
} from "./driver.elements";

import Profile from "../Profile";
import Glitch from "../../Resources/Utils/error";

import {
  Navbar,
  DriverRegistrationForm,
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
  const [account_status, setAccountStatus] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const currentUser = AuthAPI.getCurrentUser();

    if (!currentUser) {
      setRedirect("/home");
    }

    UserAPI.getDriverBoard()
      .then((response) => {
        const { id } = response.data;
        setUser(response.data);
        setAccountStatus(response.data.account_status);
        setUserReady(true);
        return id;
      })
      .then((id) => {
        DriverAPI.check_approval(id).then((response) => {
          setApprovalStatus(response.data.approval_status);
        });
      })
      .catch((error) => {
        setUser(undefined);
        setApprovalStatus(null);
        setAccountStatus(null);
        addToast(Glitch.message(error), {
          appearance: "error",
        });
      });
  }, [addToast]);

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  const logOutCallBack = () => {
    AuthAPI.logout();
    setUserReady(false);
    history.push("/");
  };

  return (
    <div>
      <Switch>
        {userReady ? (
          <div>
            <Route path={`${path}`} exact>
              <Box container justify="space-between">
                {account_status === "SUSPENDED" ? (
                  <MessageDisplay
                    message="We regret to notify you that your Account has been suspended please contact the adminstration for more information"
                    logOutCallBack={logOutCallBack}
                  />
                ) : approval_status === "A" && account_status === "ACTIVE" ? (
                  <div>
                    <Container>
                      <Navbar />
                    </Container>
                    <p>Comming soon</p>
                  </div>
                ) : approval_status === "D" && account_status === "ACTIVE" ? (
                  <MessageDisplay
                    message="We regret to notify you that your registration has been denied please try again after a period of 3 months"
                    logOutCallBack={logOutCallBack}
                  />
                ) : approval_status === "P" && account_status === "ACTIVE" ? (
                  <MessageDisplay
                    message="Registration successful pending approval please wait ..."
                    logOutCallBack={logOutCallBack}
                  />
                ) : (
                  <PageContainer
                    container
                    justify="center"
                    alignContent="center"
                  >
                    <Grid item xs={12} sm={6} md={6}>
                      <DriverRegistrationForm USER_ID={user.userId} />
                    </Grid>
                  </PageContainer>
                )}
              </Box>
            </Route>

            <Route path={`${path}/orders-list`} exact>
              <Box container justify="space-between">
                {account_status === "SUSPENDED" ? (
                  <MessageDisplay
                    message="We regret to notify you that your Account has been suspended please contact the adminstration for more information"
                    logOutCallBack={logOutCallBack}
                  />
                ) : approval_status === "A" && account_status === "ACTIVE" ? (
                  <Container>
                    <Navbar />
                    <OrderList user={user} />
                  </Container>
                ) : approval_status === "P" && account_status === "ACTIVE" ? (
                  <MessageDisplay
                    message="Registration successful pending approval please wait ..."
                    logOutCallBack={logOutCallBack}
                  />
                ) : approval_status === "D" && account_status === "ACTIVE" ? (
                  <MessageDisplay
                    message="We regret to notify you that your registration has been denied please try again after a period of 3 months"
                    logOutCallBack={logOutCallBack}
                  />
                ) : (
                  <PageContainer
                    container
                    justify="center"
                    alignContent="center"
                  >
                    <Grid item xs={12} sm={6} md={6}>
                      <DriverRegistrationForm USER_ID={user.userId} />
                    </Grid>
                  </PageContainer>
                )}
              </Box>
            </Route>

            <Route path={`${path}/profile`} exact>
              {account_status === "SUSPENDED" ? (
                <MessageDisplay
                  message="We regret to notify you that your Account has been suspended please contact the adminstration for more information"
                  logOutCallBack={logOutCallBack}
                />
              ) : approval_status === "A" && account_status === "ACTIVE" ? (
                <div>
                  <Container>
                    <Navbar />
                  </Container>
                  <Profile />
                </div>
              ) : approval_status === "P" && account_status === "ACTIVE" ? (
                <MessageDisplay
                  message="Registration successful pending approval please wait ..."
                  logOutCallBack={logOutCallBack}
                />
              ) : approval_status === "D" && account_status === "ACTIVE" ? (
                <MessageDisplay
                  message="We regret to notify you that your registration has been denied please try again after a period of 3 months"
                  logOutCallBack={logOutCallBack}
                />
              ) : null}
            </Route>
          </div>
        ) : null}
      </Switch>
      <Footer />
    </div>
  );
}

export const MessageDisplay = ({ message, logOutCallBack }) => (
  <PageContainer
    container
    alignContent="center"
    justify="center"
    direction="column"
  >
    <MessageWrapper item>
      <Grid container alignItems="center" justify="center" direction="column">
        <Grid item>
          <AlertIcon />
        </Grid>
        <Grid item>
          <Message>{message}</Message>
        </Grid>
        <Grid item>
          <LinkButton
            primary="true"
            to="/goodbye"
            onClick={(e) => {
              e.preventDefault();
              logOutCallBack();
            }}
          >
            Exit
          </LinkButton>
        </Grid>
      </Grid>
    </MessageWrapper>
  </PageContainer>
);
