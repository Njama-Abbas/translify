import React, { useState } from "react";
import { IconContext } from "react-icons";
import Grid from "@material-ui/core/Grid";
import { Button } from "../../Resources/Styles/global";
import { useToasts } from "react-toast-notifications";
import { LoadingComponent } from "../../Components";
import Glitch from "../../Resources/Utils/error";

import { AuthAPI } from "../../Api";
import {
  PageContainer,
  AlertIcon,
  Wrapper,
  InputField,
  TextContent,
} from "./elements";

const ForgotPassWord = () => {
  const [phoneno, setPhoneno] = useState(null);

  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);

  const handlePhonenoCodeChange = (e) => {
    setPhoneno(e.target.value);
  };

  return (
    <IconContext.Provider
      value={{
        color: "#000",
      }}
    >
      <PageContainer
        container
        justify="center"
        direction="column"
        alignContent="center"
      >
        <form>
          <Wrapper item>
            <Grid
              container
              justify="center"
              direction="column"
              alignContent="center"
            >
              <Grid item>
                <AlertIcon />
              </Grid>
              <Grid item>
                <TextContent>
                  Enter Registered Phone No to get a password reset code
                </TextContent>
              </Grid>
              <Grid item>
                <InputField
                  type="number"
                  placeholder="e.g 713213543"
                  required
                  value={phoneno}
                  onChange={handlePhonenoCodeChange}
                />
              </Grid>
              <Grid item>
                <Grid container justify="space-around">
                  <Grid item>
                    <Button warning type="button">
                      Send Code
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button primary type="button">
                      Exit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Wrapper>
        </form>
      </PageContainer>
    </IconContext.Provider>
  );
};

export default ForgotPassWord;
