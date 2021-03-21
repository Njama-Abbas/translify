import React from "react";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";

import {
  DriverDetails,
  ProfileImage,
  DriverContainer,
  DriverItemBox,
} from "./elements";
import IMG from "../../Resources/Images/undraw_profile_pic.svg";

const DriverListItem = ({ driver }) => {
  return (
    <DriverContainer>
      <DriverItemBox>
        <ProfileImage src={IMG} />
        <DriverDetails>
          <p>
            Name:{" "}
            <b>
              {driver.firstname}&nbsp;{driver.lastname}
            </b>
          </p>
          <DriverItemBox>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="read-only"
              value={driver.rating}
              precision={0.5}
              readOnly
            />
          </DriverItemBox>
          <Typography component="p">
            <i>5 minutes away</i>
          </Typography>
        </DriverDetails>
      </DriverItemBox>
    </DriverContainer>
  );
};

export default DriverListItem;
