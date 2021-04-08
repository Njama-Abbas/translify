import React from "react";
import { Switch, Route } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";
import GlobalStyle from "./Resources/Styles/global";
import FileUploadComponent from "./Components/UploadPhoto";
import { ToastProvider } from "react-toast-notifications";

import {
  Home,
  Discover,
  SignUp,
  SignIn,
  Client,
  Driver,
  Verification,
} from "./Pages";

export default function App() {
  return (
    <ToastProvider autoDismiss autoDismissTimeout={7000}>
      <GlobalStyle />
      <ScrollToTop />
      <Switch>
        <Route exact path={["/", "/home"]} component={Home} />
        <Route exact path="/discover" component={Discover} />
        <Route exact path="/verify-account" component={Verification} />
        <Route exact path="/driver/sign-up">
          <SignUp route="driver" />
        </Route>
        <Route exact path="/driver/sign-in">
          <SignIn route="driver" />
        </Route>

        <Route exact path="/client/sign-up">
          <SignUp route="client" />
        </Route>
        <Route exact path="/client/sign-in">
          <SignIn route="client" />
        </Route>

        <Route exact path="/test" component={FileUploadComponent} />
        <Route path="/client" component={Client} />
        <Route path="/driver" component={Driver} />
      </Switch>
    </ToastProvider>
  );
}
