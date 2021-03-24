import React, { useEffect, useState } from "react";
import {
  PageContainer,
  VerificationWrapper,
  VerificationHeader,
  AlertIcon,
  InputField,
} from "./elements";
import { useSelector } from "react-redux";
import { IconContext } from "react-icons";
import Grid from "@material-ui/core/Grid";
import { Button } from "../../Resources/Styles/global";
import { selectUser } from "../../State/user.slice";

const Verification = () => {
  const user = useSelector(selectUser);

  return (
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
            <form>
              <Grid item>
                <AlertIcon />
              </Grid>
              <Grid item>
                <VerificationHeader>
                  To Continue Verify Your Account. Please Enter 8-Digit Short
                  code send to <br /> <b>{user.phoneno}</b>
                </VerificationHeader>
              </Grid>
              <Grid item>
                <InputField type="number" placeholder="e.g 12345678" required />
              </Grid>
              <Grid item>
                <Grid container justify="space-around">
                  <Grid item>
                    <Button warning type="button">
                      Resend
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button primary type="submit">
                      Confirm
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </VerificationWrapper>
      </PageContainer>
    </IconContext.Provider>
  );
};

export default Verification;
