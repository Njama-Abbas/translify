import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { ListColum, ListRow } from "./elements";
import ListItem from "./ListItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "../../state/cliets.slice";
import LoadingComponent from "../LoadingComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ClientList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const request_status = useSelector((state) => state.clients.status);
  const clients = useSelector((state) => state.clients.list);

  useEffect(() => {
    if (request_status === "idle") {
      dispatch(fetchClients());
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
    content = clients.map((client) => <ListItem key={client.id} {...client} />);
  }
  return (
    <List className={classes.root}>
      <ListRow>
        <ListColum>Avatar</ListColum>
        <ListColum>Username</ListColum>
        <ListColum>Phoneno</ListColum>
        <ListColum>Avg Rating</ListColum>
        <ListColum>Account Status</ListColum>
        <ListColum>Deactivate</ListColum>
        <ListColum>Delete</ListColum>
      </ListRow>
      {content}
    </List>
  );
}
