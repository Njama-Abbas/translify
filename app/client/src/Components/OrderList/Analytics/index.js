import { Grid } from "@material-ui/core";
import React from "react";
import {
  Wrapper,
  CounterElemement,
  CounterNumber,
  CounterLabel,
} from "./elements";

const Analytics = ({ data }) => {
  return (
    <Wrapper justify="space-around" alignContent="center" container>
      {data.map((item) => (
        <AnalyticsItem key={item.label} label={item.label} count={item.count} />
      ))}
    </Wrapper>
  );
};

export default Analytics;

function AnalyticsItem({ count, label }) {
  return (
    <Grid item>
      <Grid container direction="column" justify="center" alignContent="center">
        <Grid item>
          <CounterElemement>
            <CounterNumber>{count}</CounterNumber>
          </CounterElemement>
        </Grid>
        <Grid item>
          <CounterLabel>{label}</CounterLabel>
        </Grid>
      </Grid>
    </Grid>
  );
}
