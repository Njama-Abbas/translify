import React from "react";
import Rating from "@material-ui/lab/Rating";
// import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

export default function ReadOnlyReview({ reviewValue }) {
  return (
    <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        {/* <Typography component="legend">Read only</Typography>*/}
        <Rating name="read-only" value={reviewValue} readOnly />
      </Box>
    </div>
  );
}
