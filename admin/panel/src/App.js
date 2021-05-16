import CssBaseline from "@material-ui/core/CssBaseline";
import { Switch, Route, Redirect } from "react-router-dom";
import { DataContainer, ContentHeader } from "./components/container";
import { Clients, Drivers, NavBar, PendingList, Profile } from "./components";
import GlobalStyle from "./Resources/Styles/global";
import { ToastProvider } from "react-toast-notifications";
import ScrollToTop from "./components/ScrollToTop";
import SignIn from "./components/Account/SignIn";
import { UserAPI } from "./api";
import { useEffect, useState } from "react";
import { ForgotPassword, ResetPassword } from "./components";

function Admin({ children }) {
  const [redirect, setRedirect] = useState(false);
  useEffect(function () {
    UserAPI.getAdminBoard().then(
      (response) => {
        setRedirect(false);
      },
      (error) => {
        setRedirect("/");
      }
    );
  }, []);

  let content;
  if (redirect) {
    content = <Redirect to={redirect} />;
  } else {
    content = <div>{children}</div>;
  }

  return content;
}

function App() {
  return (
    <ToastProvider autoDismiss autoDismissTimeout={10000}>
      <GlobalStyle />
      <ScrollToTop />
      <CssBaseline />
      <Switch>
        <Route path="/admin/clients" exact>
          <Admin>
            <NavBar />
            <DataContainer>
              <ContentHeader>Clients</ContentHeader>
              <Clients />
            </DataContainer>
          </Admin>
        </Route>
        <Route path="/admin/drivers" exact>
          <Admin>
            <NavBar />
            <DataContainer>
              <ContentHeader>Drivers</ContentHeader>
              <Drivers />
            </DataContainer>
          </Admin>
        </Route>
        <Route path="/admin/settings" exact>
          <Admin>
            <NavBar />
            <DataContainer>
              <Profile />
            </DataContainer>
          </Admin>
        </Route>

        <Route path="/admin/pending-approvals" exact>
          <Admin>
            <NavBar />
            <DataContainer>
              <ContentHeader>Drivers Pending Approval</ContentHeader>
              <PendingList />
            </DataContainer>
          </Admin>
        </Route>
        <Route path={["/admin", "/admin/home"]} exact>
          <Admin>
            <NavBar />
            <DataContainer>
              <ContentHeader>Clients</ContentHeader>
              <Clients />
              <ContentHeader>Drivers</ContentHeader>
              <Drivers />
            </DataContainer>
          </Admin>
        </Route>
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route path="/" exact>
          <SignIn />
        </Route>
      </Switch>
    </ToastProvider>
  );
}

export default App;
