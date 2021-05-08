import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { useDispatch } from "react-redux";
import { accessTokenSet } from "../../State/user.slice";
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
  const dispatch = useDispatch();

  useEffect(() => {
    AuthAPI.getCurrentUser()
      .then(
        (response) => {
          dispatch(accessTokenSet(response.data.accesstoken));
        },
        (error) => {
          dispatch(accessTokenSet(""));
          setRedirect("/home");
          console.log(error);
        }
      )
      .then(() => {
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
      });
  }, [addToast, dispatch]);

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
      <div>{userReady ? <h1>{user.username}</h1> : null}</div>
    </Switch>
  );
}

/**@todo
 * Solve token expired problem with nav
 */
