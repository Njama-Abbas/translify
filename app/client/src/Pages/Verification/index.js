import React from "react";
import {
  PageContainer,
  VerificationWrapper,
  VerificationHeader,
  AlertIcon,
  InputField,
} from "./elements";
import { IconContext } from "react-icons";
import Grid from "@material-ui/core/Grid";
import { Button } from "../../Resources/Styles/global";

const Verification = () => {
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
                  Enter 8-Digit Verification code send to 0748717044
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
