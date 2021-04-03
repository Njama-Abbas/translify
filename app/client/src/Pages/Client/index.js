import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";

import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import { UserAPI, AuthAPI } from "../../Api";
import { Container } from "../../Resources/Styles/global";
import { ClientInfo } from "../../Resources/Data/clientinfo";
import { Box } from "./client.elements";

import { Navbar, ClientInfoSection, Footer, OrderList } from "../../Components";

import OrderTruck from "../OrderPage";
import Profile from "../Profile";

export default function Client() {
  const { path } = useRouteMatch();
  const { addToast } = useToasts();

  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(null);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const currentUser = AuthAPI.getCurrentUser();

    if (!currentUser) {
      setRedirect("/home");
    }

    UserAPI.getClientBoard().then(
      (response) => {
        setUser(response.data);
        setUserReady(true);
      },
      (error) => {
        addToast(`An error occured ${error.response.data.message} `, {
          appearance: "error",
        });
        setUser(undefined);
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
                </Container>
                <Container>
                  <OrderList user={user} />
                  <ClientInfoSection {...ClientInfo} />
                </Container>
              </Box>
              <Footer />
            </div>
          ) : null}
        </div>
      </Route>
      <Route path={`${path}/order-truck`}>
        <OrderTruck />
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

/**@todo
 * Solve token expired problem with nav
 */
