import React, { useEffect, useState } from "react";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import { PhotoAPI } from "../../../Api";

import {
  DriverDetails,
  DriverProfileImage,
  DriverItem,
  DriverItemWrapper,
} from "./elements";
import IMG from "../../../Resources/Images/undraw_profile_pic.svg";

const DriverListItem = ({ driver, onclick, designated }) => {
  const [profileImageId, setProfileImageId] = useState(null);

  useEffect(() => {
    PhotoAPI.getProfileID(driver.userId).then(
      (response) => {
        setProfileImageId(response.data.photo_id);
      },
      (error) => {
        setProfileImageId(null);
      }
    );
  }, [driver.userId]);

  return (
    <DriverItem designated={designated} onClick={onclick}>
      <DriverItemWrapper>
        <DriverProfileImage
          src={
            profileImageId
              ? `http://localhost:801/api/photos/${profileImageId}`
              : IMG
          }
        />
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
