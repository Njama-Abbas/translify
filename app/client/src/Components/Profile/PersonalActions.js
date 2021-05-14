import React, { useEffect, useState } from "react";
import ChangePasswordDialog from "./ChangePassword";
import WithdrawDialog from "./Withdraw";
import Grid from "@material-ui/core/Grid";
import { AuthAPI } from "../../Api";
import { AccountBalance, Money } from "./Profile.elements";
import { currencyToString } from "../../Resources/Utils/price";

const PersonalActions = ({ user: currentUser }) => {
  const [accountBalance, setAccountBalance] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = AuthAPI.getCurrentUser();
    if (!user) {
      setUser(null);
    } else {
      setUser(user);
      AuthAPI.getAccountBalance(user.id).then(
        (response) => {
          setAccountBalance(response.data.account_balance);
        },
        (error) => {
          setAccountBalance(0);
        }
      );
    }
  }, []);

  return (
    <Grid item md={6} sm={8} xs={12}>
      <Grid container justify="center" direction="column">
        {currentUser.role === "driver" ? (
          <Grid item xs={12}>
            <AccountBalance>
              Trans-Bank
              <br />
              <Money>Ksh: {currencyToString(Math.round(accountBalance))}</Money>
            </AccountBalance>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={6}>
              <ChangePasswordDialog user={currentUser} />
            </Grid>
            {currentUser.role === "driver" ? (
              <Grid item xs={6}>
                <WithdrawDialog />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PersonalActions;
