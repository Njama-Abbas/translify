import CssBaseline from "@material-ui/core/CssBaseline";
import { Switch, Route, Redirect } from "react-router-dom";
import { DataContainer } from "./components/container";
import { Clients, Drivers, NavBar } from "./components";
import GlobalStyle from "./Resources/Styles/global";
import { ToastProvider } from "react-toast-notifications";
import ScrollToTop from "./components/ScrollToTop";
import SignIn from "./components/Account/SignIn";
import { UserAPI } from "./api";
import { useEffect, useState } from "react";

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
              <Clients />
            </DataContainer>
          </Admin>
        </Route>
        <Route path="/admin/drivers" exact>
          <Admin>
            <NavBar />
            <DataContainer>
              <Drivers />
            </DataContainer>
          </Admin>
        </Route>
        <Route path="/admin/settings" exact>
          <Admin>
            <NavBar />
            <DataContainer>
              <h1>Settings Page</h1>
            </DataContainer>
          </Admin>
        </Route>
        <Route path={["/admin", "/admin/home"]} exact>
          <Admin>
            <NavBar />
            <DataContainer>
              <h1>Home Page</h1>
            </DataContainer>
          </Admin>
        </Route>
        <Route path="/" exact>
          <SignIn />
        </Route>
      </Switch>
    </ToastProvider>
  );
}

export default App;
