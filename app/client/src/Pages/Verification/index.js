import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";

import {
  PageContainer,
  VerificationWrapper,
  VerificationHeader,
  AlertIcon,
  InputField,
} from "./elements";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { IconContext } from "react-icons";
import Grid from "@material-ui/core/Grid";
import { Button, LinkButton } from "../../Resources/Styles/global";
import { selectUser } from "../../State/user.slice";
import { AuthAPI } from "../../Api";
import { LoadingComponent } from "../../Components";

const Verification = () => {
  const { addToast } = useToasts();
  const user = useSelector(selectUser);
  const [redirect, setRedirect] = useState(null);
  const [shortCode, setShortCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShortCodeChange = (event) => {
    setShortCode(event.target.value);
  };

  const handleResendRequest = () => {
    setIsLoading(true);
    AuthAPI.resendVerificationCode(user.ID).then(
      (response) => {
        setIsLoading(false);
        addToast("Code sent");
      },
      (error) => {
        addToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString(),
          {
            appearance: "error",
          }
        );
        setIsLoading(false);
      }
    );
  };

  const handleSubmit = () => {
    if (shortCode) {
      setIsLoading(true);
      AuthAPI.verify(user.ID, shortCode).then(
        (user) => {
          addToast(`${user.role} Verified id: ${user.id}`, {
            appearance: "info",
          });
          setRedirect(`${user.role}`);
        },
        (error) => {
          setMessage(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
              error.message ||
              error.toString()
          );
          console.log(message);
        }
      );
      setIsLoading(false);
    } else {
      return;
    }
  };
  let content;

  if (redirect) {
    content = <Redirect to={redirect} />;
  } else if (isLoading) {
    content = <LoadingComponent />;
  } else {
    content = (
      <IconContext.Provider
        value={{
          color: "#fff",
        }}
      >
        <PageContainer container alignContent="center" justify="center">
          <VerificationWrapper item>
            <Grid
              container
              justify="center"
              direction="column"
              alignContent="center"
            >
              {user.ID ? (
                <form>
                  <Grid item>
                    <AlertIcon />
                  </Grid>
                  <Grid item>
                    <VerificationHeader>
                      To Continue Verify Your Account. Please Enter 8-Digit
                      Short code send to <br /> <b>{user.phoneno}</b>
                    </VerificationHeader>
                  </Grid>
                  <Grid item>
                    <InputField
                      type="number"
                      placeholder="e.g 12345678"
                      required
                      onChange={handleShortCodeChange}
                    />
                  </Grid>
                  <Grid item>
                    <Grid container justify="space-around">
                      <Grid item>
                        <Button
                          warning
                          type="button"
                          onClick={handleResendRequest}
                        >
                          Resend
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button primary type="button" onClick={handleSubmit}>
                          Confirm
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              ) : (
                <Grid
                  container
                  justify="center"
                  alignContent="center"
                  alignItems="center"
                  direction="column"
                >
                  <Grid item>
                    <VerificationHeader
                      style={{
                        paddingTop: "30px",
                        fontSize: "2.2em",
                      }}
                    >
                      Please sign up for an account to continue
                    </VerificationHeader>
                  </Grid>
                  <br />
                  <br />
                  <br />
                  <Grid item>
                    <LinkButton primary to="/home">
                      Get Started
                    </LinkButton>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </VerificationWrapper>
        </PageContainer>
      </IconContext.Provider>
    );
  }

  return content;
};

export default Verification;
