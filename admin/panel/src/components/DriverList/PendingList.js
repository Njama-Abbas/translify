import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { ListColum, ListRow } from "../ClientList/elements";
import ListItem from "./ListItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrivers, selectPending } from "../../state/driver.slice";
import LoadingComponent from "../LoadingComponent";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function PendingApproval() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const request_status = useSelector((state) => state.drivers.status);
  const drivers = useSelector(selectPending);

  useEffect(() => {
    if (request_status === "idle") {
      dispatch(fetchDrivers());
    }
  }, [request_status, dispatch]);

  let content;

  if (request_status === "loading") {
    content = <LoadingComponent />;
  } else if (request_status === "failed") {
    content = (
      <LoadingComponent message="An error occurred, ... retryting  ..... " />
    );
  } else if (request_status === "succeeded") {
    content = drivers.map((driver) => <ListItem key={driver.id} {...driver} />);
  }

  return (
    <List className={classes.root}>
      <ListRow cols={10}>
        <ListColum>Avatar</ListColum>
        <ListColum>Username</ListColum>
        <ListColum>Driving Licence</ListColum>
        <ListColum>Truck Number</ListColum>
        <ListColum>Approval</ListColum>
        <ListColum>{""}</ListColum>
        <ListColum>Avg Rating</ListColum>
        <ListColum>Account Status</ListColum>
        <ListColum>Deactivate</ListColum>
        <ListColum>Delete</ListColum>
      </ListRow>
      {content}
    </List>
  );
}
