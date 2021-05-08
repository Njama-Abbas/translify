import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { Dialog, DialogContent, Slide, Grid } from "@material-ui/core";
import { Button } from "../../../Resources/Styles/global";
import { ReviewHeader, ReviewText, ReviewWrapper } from "./elements";

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const useStyles = makeStyles({
  root: {
    width: 200,
    display: "flex",
    alignItems: "center",
  },
});

function HoverRating({ reviewValue, handleReviewValueChange }) {
  const [hover, setHover] = React.useState(-1);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Rating
        name="hover-feedback"
        value={reviewValue}
        precision={0.5}
        onChange={(event, newValue) => {
          handleReviewValueChange(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {reviewValue !== null && (
        <ReviewText>{labels[hover !== -1 ? hover : reviewValue]}</ReviewText>
      )}
    </div>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RatingDialogBox({ handlereview }) {
  const [open, setOpen] = React.useState(false);
  const [reviewValue, setReviewValue] = React.useState(3);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReviewSubmit = () => {
    handlereview(reviewValue);
  };

  const handleReviewValueChange = (value) => {
    setReviewValue(value);
  };

  return (
    <div>
      <Button small primary onClick={handleClickOpen}>
        Rate and Review
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="edit-info-dialog-slide-title"
        aria-describedby="edit-info-dialog-slide-description"
        style={{
          backgroundColor: "rgba(4, 0, 0, 0.596)",
        }}
      >
        <DialogContent>
          <ReviewWrapper>
            <Grid
              container
              spacing={5}
              direction="column"
              justify="center"
              alignContent="center"
            >
              <Grid item>
                <ReviewHeader>How satisfied were you?</ReviewHeader>
              </Grid>
              <Grid
                item
                style={{
                  backgroundColor: "#7c7b7b",
                  borderRadius: "8px",
                }}
              >
                <HoverRating
                  reviewValue={reviewValue}
                  handleReviewValueChange={handleReviewValueChange}
                />
              </Grid>
              <Grid item>
                <Button primary fullWidth onClick={handleReviewSubmit}>
                  Submit Review
                </Button>
              </Grid>
            </Grid>
          </ReviewWrapper>
        </DialogContent>
      </Dialog>
    </div>
  );
}
