import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import { AuthAPI } from "../../Api";
import { useDispatch } from "react-redux";

import {
  MdLockOutline,
  MdVisibility,
  MdVisibilityOff,
  MdPhone,
  MdEnhancedEncryption,
} from "react-icons/md";

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
import { ErrorMessage } from "../Error/validation.elements";

import LoadingComponent from "../LoadingComponent";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();
  const [message, setMessage] = useState("");

  const { register, handleSubmit, errors } = useForm({
    reValidateMode: "onChange",
    mode: "onBlur",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState("");

  const handleShowPassword = () => {
    setShowPassword((prevState) => {
      return !prevState;
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (formData) => {
    const { auth_code, password_y, password_x } = formData;
    setIsLoading(true);
    let newPassword = null;
    if (password_y !== password_x) {
      setMessage("Passwords Did not match");
    } else {
      newPassword = password_y;
      console.log({
        auth_code,
        newPassword,
      });
      setMessage("");
    }
    setIsLoading(false);
  };

  let content;

  if (isLoading) {
    content = <LoadingComponent />;
  } else {
    content = (
      <FormContainer container>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <FormPaper>
            <FormAvatar>
              <MdLockOutline />
            </FormAvatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    inputRef={register({
                      required: true,
                      maxLength: 8,
                      minLength: 8,
                    })}
                    name="auth_code"
                    label="Short-Code"
                    type="number"
                    id="auth_code"
                    required
                    autoComplete="auth_code"
                    placeholder="e.g 00000000"
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
                    fieldName="auth_code"
                    requiredErrorMsg="Authentication code is Required"
                    lengthErrorMsg="Invalid Authentication code"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputRef={register({
                      required: true,
                      pattern: ValidationPatterns.password,
                    })}
                    variant="outlined"
                    required
                    fullWidth
                    name="password_y"
                    label="Enter New Password"
                    type={showPassword ? "text" : "password"}
                    id="password_y"
                    autoComplete="password_y"
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
                  <ValidationError
                    errors={errors}
                    fieldName="password_y"
                    patternErrorMsg="Password must be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"
                    requiredErrorMsg="Password is Required"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputRef={register({
                      required: true,
                      pattern: ValidationPatterns.password,
                    })}
                    placeholder=" e.g 123Asd"
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
                    variant="outlined"
                    required
                    fullWidth
                    name="password_x"
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    id="password_x"
                    autoComplete="password_x"
                  />
                  <ValidationError
                    errors={errors}
                    fieldName="password_x"
                    patternErrorMsg="Password must be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"
                    requiredErrorMsg="Password is Required"
                  />
                  {message && <ErrorMessage>{message}</ErrorMessage>}
                </Grid>
              </Grid>
              <br />
              <SubmitButton type="submit" secondary>
                Continue
              </SubmitButton>
            </Form>
          </FormPaper>
        </Container>
      </FormContainer>
    );
  }

  return content;
}
