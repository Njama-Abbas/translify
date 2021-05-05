import React, { useState } from "react";
import { IconContext } from "react-icons";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Grid, InputAdornment, TextField } from "@material-ui/core";
import { Button } from "../../Resources/Styles/global";
import { useToasts } from "react-toast-notifications";
import { LoadingComponent } from "../../Components";
import Glitch from "../../Resources/Utils/error";
import { useForm } from "react-hook-form";

import { MdPhone } from "react-icons/md";

import ValidationError from "../Error/Validation";
import ValidationPatterns from "../../Resources/Patterns/validation";

import { AuthAPI } from "../../Api";
import { userSet } from "../../State/user.slice";
import { PageContainer, AlertIcon, Wrapper, TextContent } from "./elements";

const ForgotPassWord = () => {
  const { register, handleSubmit, errors } = useForm({
    reValidateMode: "onChange",
    mode: "onBlur",
  });
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const [redirect, setRedirect] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const submit = (data) => {
    setIsLoading(true);
    const { phoneno } = data;
    AuthAPI.getPasswordResetAuthCode("254" + phoneno.slice(-9))
      .then((response) => {
        const { data: user } = response;
        dispatch(
          userSet({
            UID: user.id,
            phoneno: user.phoneno,
            verified: user.verification.status,
          })
        );
        setRedirect("/reset-password");
      })
      .catch((error) => {
        addToast(Glitch.message(error), {
          appearance: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  let content;

  if (isLoading) {
    content = <LoadingComponent />;
  } else if (redirect) {
    content = <Redirect to={redirect} />;
  } else {
    content = (
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
          <form onSubmit={handleSubmit(submit)}>
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
                <Grid
                  item
                  xs={12}
                  style={{
                    margin: "10px auto",
                  }}
                >
                  <TextField
                    variant="outlined"
                    fullWidth
                    inputRef={register({
                      required: true,
                      pattern: ValidationPatterns.phoneno,
                    })}
                    name="phoneno"
                    label="Phoneno"
                    type="number"
                    id="phoneno"
                    required
                    autoComplete="phoneno"
                    placeholder="e.g 0712345678"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MdPhone />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ValidationError
                    errors={errors}
                    fieldName="phoneno"
                    patternErrorMsg="Icorrect Format!"
                    requiredErrorMsg="Phone No is Required"
                  />
                </Grid>
                <Grid item>
                  <Grid container justify="space-around">
                    <Grid item>
                      <Button warning type="submit">
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
  }
  return content;
};

export default ForgotPassWord;
