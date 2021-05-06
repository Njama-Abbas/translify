import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import Glitch from "../../Resources/Utils/error";

import {
  Dialog,
  DialogContent,
  Slide,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  InputAdornment,
} from "@material-ui/core";
import { Button } from "../../Resources/Styles/global";
import { useForm } from "react-hook-form";

import ValidationError from "../Error/Validation";
import ValidationPatterns from "../../Resources/Patterns/validation";
import { Form, FormAvatar, FormPaper } from "./Profile.elements";
import { IoPencil, IoPerson } from "react-icons/io5";
import { AuthAPI } from "../../Api";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditInfoDialog({ user, setLoading }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button fullWidth primary onClick={handleClickOpen}>
        Edit Personal Info
      </Button>
      <Dialog
        open={open}
        disableBackdropClick
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="edit-info-dialog-slide-title"
        aria-describedby="edit-info-dialog-slide-description"
      >
        <DialogContent>
          <EditForm
            currentUser={user}
            handleClose={handleClose}
            setLoading={setLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const EditForm = ({ currentUser, handleClose, setLoading }) => {
  const { register, handleSubmit, errors } = useForm({
    reValidateMode: "onBlur",
    mode: "onChange",
  });
  const { addToast } = useToasts();

  // const [message, showMessage] = useState("");

  const { firstname, lastname, username } = currentUser;

  const [new_fname, setFname] = useState(firstname);
  const [new_lname, setLname] = useState(lastname);
  const [new_username, setUserName] = useState(username);

  const onSubmit = (data) => {
    setLoading(true);
    AuthAPI.updateInfo(currentUser.id, data).then(
      (response) => {
        addToast(
          `SUCCESS!
          Details will be updated next time you log in
          `,
          {
            appearance: "success",
          }
        );
        handleClose();
      },
      (error) => {
        let message = Glitch.message(error);
        addToast(message, {
          appearance: "error",
        });
      }
    );
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <FormPaper elevation={6}>
        <FormAvatar>
          <IoPencil />
        </FormAvatar>
        <Typography component="h1" variant="h5">
          Edit details
        </Typography>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                inputRef={register({
                  required: true,
                  pattern: /^[a-z0-9_-]{3,16}$/gi,
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoPerson />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                required
                value={new_username}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoComplete="username"
              />
              <ValidationError
                errors={errors}
                fieldName="username"
                requiredErrorMsg="Username Is Required"
                patternErrorMsg="Username must be 3 to 16 characters and should not contain spaces or special symbols"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                inputRef={register({
                  required: true,
                  pattern: ValidationPatterns.name,
                  minLength: 4,
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoPerson />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setFname(e.target.value)}
                variant="outlined"
                required
                value={new_fname}
                fullWidth
                id="firstname"
                label="First Name"
                name="firstname"
                autoComplete="firstname"
              />
              <ValidationError
                errors={errors}
                fieldName="firstname"
                requiredErrorMsg="First Name Required"
                patternErrorMsg="Alphabets only"
                lengthErrorMsg="Minimum of 4 Characters!"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                inputRef={register({
                  required: true,
                  pattern: ValidationPatterns.name,
                  minLength: 4,
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoPerson />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setLname(e.target.value)}
                variant="outlined"
                fullWidth
                value={new_lname}
                required
                id="lastname"
                label="Last Name"
                name="lastname"
                autoComplete="lastname"
              />
              <ValidationError
                errors={errors}
                fieldName="lastname"
                patternErrorMsg="Alphabets Only!"
                requiredErrorMsg="Last Name Required"
                lengthErrorMsg="Minimum of 4 Characters!"
              />
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  margin: "auto",
                }}
              >
                <Button primary type="submit">
                  Continue
                </Button>
                <Button secondary type="button" onClick={handleClose}>
                  Exit
                </Button>
              </div>
            </Grid>
          </Grid>
        </Form>
      </FormPaper>
    </Container>
  );
};
