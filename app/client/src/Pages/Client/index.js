import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";

import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import { UserAPI, AuthAPI } from "../../Api";
import { activeOrderChanged, selectOrders } from "../../State/orders.slice";
import { Container } from "../../Resources/Styles/global";
import { ClientInfo } from "../../Resources/Data/clientinfo";
import { Box } from "./client.elements";

import {
  Navbar,
  OrderDetails,
  ClientInfoSection,
  Footer,
  Orders,
} from "../../Components";

import OrderTruck from "../OrderPage";
import Profile from "../Profile";

export default function Client() {
  const { path } = useRouteMatch();
  const { addToast } = useToasts();

  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(null);
  const [user, setUser] = useState(undefined);

  const setActiveIndex = (id) => {
    dispatch(activeOrderChanged(id));
  };

  useEffect(() => {
    const currentUser = AuthAPI.getCurrentUser();

    if (!currentUser) {
      setRedirect("/home");
    }

    UserAPI.getClientBoard().then(
      (response) => {
        const { _id: userId } = response.data;
        setUser({
          userId,
        });
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
                  <Grid container spacing={8} justify="center">
                    <Grid item xs={12} sm={8} md={6}>
                      <Orders setActiveIndex={setActiveIndex} user={user} />
                    </Grid>
                    <Grid item xs={12} sm={8} md={6}>
                      {orders.length ? <OrderDetails user={user} /> : null}
                    </Grid>
                  </Grid>
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
