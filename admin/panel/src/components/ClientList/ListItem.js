import React from "react";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { MdImage } from "react-icons/md";
import { DataItem, ListRow } from "./elements";
import { ChangeStatusButton, DeleteButton } from "../controls";
import { useDispatch } from "react-redux";
import { updateStatus, deleteUser } from "../../state/cliets.slice";

export default function ListItem({
  username,
  phoneno,
  rating,
  account_status,
  id,
}) {
  const dispatch = useDispatch();

  const handleStatusChange = () => {
    dispatch(
      updateStatus({
        id,
        status: account_status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteUser(id));
  };

  return (
    <ListRow>
      <ListItemAvatar>
        <Avatar>
          <MdImage />
        </Avatar>
      </ListItemAvatar>
      <DataItem>{username}</DataItem>
      <DataItem>{phoneno}</DataItem>
      <DataItem>{rating}</DataItem>
      <DataItem>{account_status}</DataItem>
      <ChangeStatusButton
        status={account_status}
        handleStatusChange={handleStatusChange}
      />
      <DeleteButton handleDelete={handleDelete} />
    </ListRow>
  );
}
