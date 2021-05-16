import React, { useEffect, useState } from "react";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { MdCancel, MdPlaylistAddCheck } from "react-icons/md";
import { DataItem, ListRow } from "../ClientList/elements";
import { useDispatch } from "react-redux";
import {
  updateStatus,
  deleteDriver,
  changeApprovalStatus,
} from "../../state/driver.slice";
import IMG from "../../Resources/Images/undraw_profile_pic.svg";
import {
  ApproveButton,
  ChangeStatusButton,
  DeclineButton,
  DeleteButton,
} from "../controls";
import { PhotoAPI } from "../../api";
export default function ListItem({
  username,
  rating,
  account_status,
  id,
  userId,
  dlno,
  approval_status,
  truckno,
}) {
  const dispatch = useDispatch();
  const [profileImageId, setProfileImageId] = useState(null);
  useEffect(() => {
    PhotoAPI.getProfileID(userId).then(
      (response) => {
        setProfileImageId(response.data.photo_id);
      },
      (error) => {
        setProfileImageId(null);
      }
    );
  }, [userId]);
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
        <Avatar
          src={
            profileImageId
              ? `http://localhost:901/api/photos/${profileImageId}`
              : IMG
          }
        ></Avatar>
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
