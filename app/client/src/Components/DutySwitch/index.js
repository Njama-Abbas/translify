import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import Glitch from "../../Resources/Utils/error";

import { DriverAPI } from "../../Api";
const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 44,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#f1f504",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `3px solid ${theme.palette.grey[900]}`,
    backgroundColor: theme.palette.grey[500],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default function CustomDutySwitch({ user }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToasts();

  const handleChange = (event) => {
    setIsLoading(true);
    DriverAPI.changeDutyStaus(user.id, event.target.checked).then(
      (response) => {
        setIsChecked(response.data.duty_status);
        addToast(response.data.message, {
          appearance: "success",
        });
        setIsLoading(false);
      },
      (error) => {
        setIsChecked(false);
        addToast(Glitch.message(error), {
          appearance: "error",
        });
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    DriverAPI.checkDutyStatus(user.id).then(
      (response) => {
        setIsChecked(response.data.duty_status);
      },
      (error) => {
        setIsChecked(false);
        addToast(Glitch.message(error), {
          appearance: "error",
        });
      }
    );
  }, [user.id, addToast, isChecked]);

  let content;
  if (isLoading) {
    content = <SimpleBackdrop />;
  } else {
    content = (
      <FormGroup>
        <FormControlLabel
          control={
            <IOSSwitch
              checked={isChecked}
              onClick={handleChange}
              onChange={handleChange}
              name="dutySwitch"
            />
          }
          label={isChecked ? "ON DUTY" : "OFF DUTY"}
        />
      </FormGroup>
    );
  }
  return content;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function SimpleBackdrop() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
