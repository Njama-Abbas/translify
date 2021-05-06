import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";

import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";

import { UserAPI, AuthAPI } from "../../Api";
import { Container } from "../../Resources/Styles/global";
import { ClientInfo } from "../../Resources/Data/clientinfo";
import { Box } from "./client.elements";

import { Navbar, ClientInfoSection, Footer, OrderList } from "../../Components";

import OrderTruck from "../OrderPage";
import Profile from "../Profile";
import { MessageDisplay } from "../Driver/index";

export default function Client() {
  const { path } = useRouteMatch();
  const { addToast } = useToasts();
  const history = useHistory();

  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(null);
  const [user, setUser] = useState(undefined);
  const [account_status, setAccountStatus] = useState(null);

  useEffect(() => {
    const currentUser = AuthAPI.getCurrentUser();

    if (!currentUser) {
      setRedirect("/home");
    }

    UserAPI.getClientBoard().then(
      (response) => {
        setUser(response.data);
        setUserReady(true);
        setAccountStatus(response.data.account_status);
      },
      (error) => {
        addToast(`An error occured ${error.response.data.message} `, {
          appearance: "error",
        });
        setUser(undefined);
      }
    );
  }, [addToast]);

  const logOutCallBack = () => {
    AuthAPI.logout();
    setUserReady(false);
    history.push("/");
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <Switch>
      <div>
        {userReady ? (
          <div>
            <Route path={path} exact>
              {account_status === "SUSPENDED" ? (
                <MessageDisplay
                  message="We regret to notify you that your Account has been suspended please contact the adminstration for more information"
                  logOutCallBack={logOutCallBack}
                />
              ) : (
                <div>
                  <Box container justify="space-between">
                    <Container>
                      <Navbar />
                    </Container>
                    <Container>
                      <OrderList user={user} />
                      <ClientInfoSection {...ClientInfo} />
                    </Container>
                  </Box>
                  <Footer />
                </div>
              )}
            </Route>
            <Route path={`${path}/order-truck`}>
              {account_status === "SUSPENDED" ? (
                <MessageDisplay
                  message="We regret to notify you that your Account has been suspended please contact the adminstration for more information"
                  logOutCallBack={logOutCallBack}
                />
              ) : (
                <div>
                  <Container>
                    <Navbar />
                  </Container>
                  <OrderTruck />
                  <Footer />
                </div>
              )}
            </Route>
            <Route path={`${path}/profile`}>
              {account_status === "SUSPENDED" ? (
                <MessageDisplay
                  message="We regret to notify you that your Account has been suspended please contact the adminstration for more information"
                  logOutCallBack={logOutCallBack}
                />
              ) : (
                <div>
                  <Container>
                    <Navbar />
                  </Container>
                  <Profile />
                  <Footer />
                </div>
              )}
            </Route>
          </div>
        ) : null}
      </div>
    </Switch>
  );
}

/**@todo
 * Solve token expired problem with nav
 */
