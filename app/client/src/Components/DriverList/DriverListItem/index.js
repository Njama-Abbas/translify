import React from "react";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";

import {
  DriverDetails,
  DriverProfileImage,
  DriverItem,
  DriverItemWrapper,
} from "./elements";
import IMG from "../../../Resources/Images/undraw_profile_pic.svg";

const DriverListItem = ({ driver, onclick, designated }) => {
  return (
    <DriverItem designated={designated} onClick={onclick}>
      <DriverItemWrapper>
        <DriverProfileImage src={IMG} />
        <DriverDetails>
          <p>
            <b>
              {driver.firstname}&nbsp;{driver.lastname}
            </b>
          </p>
          <DriverItemWrapper>
            <Rating
              name="read-only"
              value={driver.rating}
              precision={0.5}
              readOnly
            />
          </DriverItemWrapper>
          <Typography component="p">
            <i>5 minutes away</i>
          </Typography>
        </DriverDetails>
      </DriverItemWrapper>
    </DriverItem>
  );
};

export default DriverListItem;
