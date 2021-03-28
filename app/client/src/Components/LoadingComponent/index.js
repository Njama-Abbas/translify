import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ProgressContainer, ProgessWrappper, ProgressText } from "./elements";

/**
 * material ui facebook loading template
 */

const useStylesFacebook = makeStyles(() => ({
  root: {
    position: "relative",
    backgroundColor: "#eeeeee",
  },
  top: {
    color: "#1a90ff",
    animationDuration: "1000ms",
  },
  circle: {
    strokeLinecap: "round",
  },
}));

export default function LoadingComponent(props) {
  const classes = useStylesFacebook();

  return (
    <ProgressContainer container justify="center" alignContent="center">
      <ProgessWrappper item>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          className={classes.top}
          classes={{
            circle: classes.circle,
          }}
          size={140}
          thickness={4}
          {...props}
        />
      </ProgessWrappper>
      <ProgressText>Loading Please Wait&nbsp;.&nbsp;.&nbsp;.</ProgressText>
    </ProgressContainer>
  );
}
