import React from "react";
import { Grid } from "@material-ui/core";
import { ProfileSection, PersonalDetailsItem } from "./Profile.elements";
import EditInfoDialog from "./EditInfo";

export default function PersonalInfo({ user, setLoading }) {
  return (
    <Grid item md={6} sm={8} xs={12}>
      <ProfileSection>
        <PersonalDetailsItem>
          <p>
            <strong>UserName:</strong>
          </p>
          <p>{user.username}</p>
        </PersonalDetailsItem>
        <PersonalDetailsItem>
          <p>
            <strong>First Name:</strong>
          </p>
          <p>{user.firstname}</p>
        </PersonalDetailsItem>
        <PersonalDetailsItem>
          <p>
            <strong>Last Name:</strong>
          </p>
          <p>{user.lastname}</p>
        </PersonalDetailsItem>
        <PersonalDetailsItem>
          <p>
            <strong>Phone No:</strong>
          </p>
          <p>{user.phoneno}</p>
        </PersonalDetailsItem>
        <div
          style={{
            display: "felex",
            flexDirection: "column",
          }}
        >
          <EditInfoDialog user={user} setLoading={setLoading} />
        </div>
      </ProfileSection>
    </Grid>
  );
}
