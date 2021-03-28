import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import { AuthAPI } from "../../Api";
import { useDispatch } from "react-redux";
import { userSet } from "../../State/user.slice";

import {
  MdLockOutline,
  MdVisibility,
  MdVisibilityOff,
  MdMailOutline,
  MdEnhancedEncryption,
} from "react-icons/md";

import { useForm } from "react-hook-form";

import {
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  IconButton,
  InputAdornment,
} from "@material-ui/core";

import {
  Form,
  SubmitButton,
  FormPaper,
  FormAvatar,
  FormContainer,
} from "./elements";

import ValidationError from "../Error/Validation";
import ValidationPatterns from "../../Resources/Patterns/validation";
import LoadingComponent from "../LoadingComponent";

export default function SignUp({ route }) {
  const { register, handleSubmit, errors } = useForm({
    reValidateMode: "onChange",
    mode: "onBlur",
  });
  const history = useHistory();
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState("");
  const [redirect, setRedirect] = useState(null);

  const handleShowPassword = () => {
    setShowPassword((prevState) => {
      return !prevState;
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const role = route;

  const onSubmit = (user) => {
    const { email, password } = user;
    setLoading(true);

    AuthAPI.login(email, password, role).then(
      () => {
        history.push(`/${route}`);
        setLoading(false);
      },

      (error) => {
        if (error.response.status === 401) {
          //unverified
          const { UID, phoneno, message } = error.response.data;
          dispatch(
            userSet({
              UID,
              phoneno,
            })
          );
          addToast(message, {
            appearance: "warning",
          });
          // redirect to verification page
          setRedirect("/verify-account");
        } else {
          const ErrorMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          addToast(ErrorMessage, {
            appearance: "error",
          });
        }
        setLoading(false);
      }
    );
  };

  let content;

  if (redirect) {
    content = <Redirect to={redirect} />;
  } else if (isLoading) {
    content = <LoadingComponent />;
  } else {
    content = (
      <FormContainer container route={route}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <FormPaper elevation={6}>
            <FormAvatar>
              <MdLockOutline />
            </FormAvatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    inputRef={register({
                      required: true,
                      pattern: ValidationPatterns.email,
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MdMailOutline />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                  <ValidationError
                    errors={errors}
                    fieldName="email"
                    requiredErrorMsg="Email is Required"
                    patternErrorMsg="Wrong Email Adress Format"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputRef={register({
                      required: true,
                    })}
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MdEnhancedEncryption />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? (
                              <MdVisibility />
                            ) : (
                              <MdVisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <br />
              <SubmitButton type="submit" secondary disabled={isLoading}>
                Continue
              </SubmitButton>
              <br />
              <br />
              <Grid container justify="flex-end">
                <Grid item xs>
                  <Link to="/forgot-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to={`/${route}/sign-up`} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          </FormPaper>
        </Container>
      </FormContainer>
    );
  }
  return content;
}
