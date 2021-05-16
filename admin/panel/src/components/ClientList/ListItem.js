import React, { useEffect, useState } from "react";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import IMG from "../../Resources/Images/undraw_profile_pic.svg";
import { DataItem, ListRow } from "./elements";
import { ChangeStatusButton, DeleteButton } from "../controls";
import { useDispatch } from "react-redux";
import { updateStatus, deleteUser } from "../../state/cliets.slice";
import { PhotoAPI } from "../../api";
export default function ListItem({
  username,
  phoneno,
  rating,
  account_status,
  id,
}) {
  const dispatch = useDispatch();
  const [profileImageId, setProfileImageId] = useState(null);
  useEffect(() => {
    PhotoAPI.getProfileID(id).then(
      (response) => {
        setProfileImageId(response.data.photo_id);
      },
      (error) => {
        setProfileImageId(null);
      }
    );
  }, [id]);

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
        <Avatar
          src={
            profileImageId
              ? `http://localhost:901/api/photos/${profileImageId}`
              : IMG
          }
        ></Avatar>
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
