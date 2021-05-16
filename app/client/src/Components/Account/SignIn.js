import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Glitch from "../../Resources/Utils/error";
import { AuthAPI } from "../../Api";
import { useDispatch } from "react-redux";
import { userSet } from "../../State/user.slice";

import {
  MdLockOutline,
  MdVisibility,
  MdVisibilityOff,
  MdAssignmentInd,
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

import ValidationError, { RenderErrorMessage } from "../Error/Validation";
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
  const [message, setMessage] = useState("");

  const handleShowPassword = () => {
    setShowPassword((prevState) => {
      return !prevState;
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = () => {
    setMessage("");
  };
  const role = route;

  const onSubmit = (user) => {
    const { username, password } = user;
    setLoading(true);

    AuthAPI.login(username, password, role).then(
      (response) => {
        dispatch(
          userSet({
            UID: response.id,
            phoneno: response.phoneno,
            verified: true,
          })
        );
        history.push(`/${route}`);
        setLoading(false);
      },

      (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            //unverified
            const { UID, phoneno, message } = error.response.data;
            dispatch(
              userSet({
                UID,
                phoneno,
                verified: false,
              })
            );
            addToast(message, {
              appearance: "warning",
            });
            // redirect to verification page
            setRedirect("/verify-account");
          } else if (
            error.response.status === 403 ||
            error.response.status === 404
          ) {
            addToast("You entered wrong credentials", {
              appearance: "error",
            });
            setMessage("Password or Username is Incorrect");
          }
        } else {
          const ErrorMessage = Glitch.message(error);
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
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MdAssignmentInd />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    required
                    onChange={handleChange}
                    fullWidth
                    id="username"
                    label="Username / Phone-No"
                    name="username"
                    autoComplete="username"
                    placeholder="Username or Phoneno"
                  />
                  <ValidationError
                    errors={errors}
                    fieldName="username"
                    requiredErrorMsg="Username is required"
                  />
                  {/**exists */}
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
                    onChange={handleChange}
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
              {message && <RenderErrorMessage msg={message} />}
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
