import React from "react";
import ChangePasswordDialog from "./ChangePassword";
import WithdrawDialog from "./Withdraw";
import Grid from "@material-ui/core/Grid";

import { AccountBalance, Money } from "./Profile.elements";

import { Button } from "../../Resources/Styles/global";
const PersonalActions = ({ user }) => {
  return (
    <Grid item md={6} sm={8} xs={12}>
      <Grid container justify="center" direction="column">
        {user.role === "driver" ? (
          <Grid item xs={12}>
            <AccountBalance>
              t-wallet:&nbsp;&nbsp;
              <Money>Ksh: 12,000</Money>
            </AccountBalance>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <Grid
            container
            justify={user.role === "driver" ? "center" : "flex-end"}
            spacing={2}
          >
            <Grid item xs={6}>
              <ChangePasswordDialog user={user} />
            </Grid>
            {user.role === "driver" ? (
              <Grid item xs={6}>
                <WithdrawDialog />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button fullWidth secondary>
                Sign Out
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button fullWidth warning>
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PersonalActions;
