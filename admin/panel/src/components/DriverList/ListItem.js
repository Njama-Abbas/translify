import React from "react";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { MdImage, MdCancel, MdPlaylistAddCheck } from "react-icons/md";
import { DataItem, ListRow } from "../ClientList/elements";
import { useDispatch } from "react-redux";
import {
  updateStatus,
  deleteDriver,
  changeApprovalStatus,
} from "../../state/driver.slice";

import {
  ApproveButton,
  ChangeStatusButton,
  DeclineButton,
  DeleteButton,
} from "../controls";

export default function ListItem({
  username,
  rating,
  account_status,
  id,
  dlno,
  approval_status,
  truckno,
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
    dispatch(deleteDriver(id));
  };

  const handleApproval = () => {
    dispatch(
      changeApprovalStatus({
        id,
        status: "A",
      })
    );
  };

  const handleDecline = () => {
    dispatch(
      changeApprovalStatus({
        id,
        status: "D",
      })
    );
  };
  return (
    <ListRow cols={10}>
      <ListItemAvatar>
        <Avatar>
          <MdImage />
        </Avatar>
      </ListItemAvatar>
      <DataItem>{username}</DataItem>
      <DataItem>{dlno}</DataItem>
      <DataItem>{truckno}</DataItem>
      {approval_status === "Pending" ? (
        <ApproveButton handleApproval={handleApproval} />
      ) : approval_status === "Approved" ? (
        <DataItem>
          <MdPlaylistAddCheck />
          <i>Approved</i>
        </DataItem>
      ) : (
        <DataItem>{""}</DataItem>
      )}
      {approval_status === "Pending" ? (
        <DeclineButton handleDecline={handleDecline} />
      ) : approval_status === "Declined" ? (
        <DataItem>
          <MdCancel />
          <i>Declined</i>
        </DataItem>
      ) : (
        <DataItem>{""}</DataItem>
      )}
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
