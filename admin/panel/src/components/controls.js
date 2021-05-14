import React from "react";
import Button from "@material-ui/core/Button";
import {
  MdDeleteForever,
  MdPlaylistAddCheck,
  MdSignalCellularOff,
  MdBorderColor,
  MdCancel,
} from "react-icons/md";

import styled from "styled-components";

const ControlButton = styled(Button)`
  padding: 8px 4px;
  margin: 4px;
`;

export const DeleteButton = ({ handleDelete }) => {
  return (
    <ControlButton
      variant="contained"
      color="secondary"
      startIcon={<MdDeleteForever />}
      onClick={handleDelete}
    >
      Delete
    </ControlButton>
  );
};

export const ChangeStatusButton = ({ status, handleStatusChange }) => {
  return (
    <ControlButton
      variant="contained"
      color={status === "ACTIVE" ? "default" : "primary"}
      startIcon={
        status === "ACTIVE" ? <MdSignalCellularOff /> : <MdPlaylistAddCheck />
      }
      onClick={handleStatusChange}
    >
      {status === "ACTIVE" ? "Suspend" : "Activate"}
    </ControlButton>
  );
};
export const ApproveButton = ({ handleApproval }) => {
  return (
    <ControlButton
      variant="contained"
      color="primary"
      onClick={handleApproval}
      startIcon={<MdBorderColor />}
    >
      Approve
    </ControlButton>
  );
};

export const DeclineButton = ({ handleDecline }) => {
  return (
    <ControlButton
      onClick={handleDecline}
      variant="contained"
      startIcon={<MdCancel />}
    >
      Decline
    </ControlButton>
  );
};
