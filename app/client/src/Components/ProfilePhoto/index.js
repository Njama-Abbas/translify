import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { AuthAPI, PhotoAPI } from "../../Api";

import {
  ProfileImage,
  Container,
  EditButton,
  Wrapper,
  FileInput,
  FormPaper,
  ProfileControls,
} from "./elements";

import imagePlaceHolder from "../../Resources/Images/undraw_profile_pic.svg";
import { IconContext } from "react-icons/lib";
import { Dialog, DialogContent, Slide } from "@material-ui/core";
import { Button } from "../../Resources/Styles/global";
import { FaEdit } from "react-icons/fa";
import { profilePicSet } from "../../State/user.slice";

export default function FileUploadComponent() {
  const user = AuthAPI.getCurrentUser();

  return (
    <Container>
      <Wrapper>
        <ProfileImage
          src={
            user.profilePhotoId
              ? `http://localhost:801/api/photos/${user.profilePhotoId}`
              : imagePlaceHolder
          }
        />
        <EditImageDialog user={user} />
      </Wrapper>
    </Container>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditImageDialog({ user }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <IconContext.Provider
      value={{
        color: "#00f",
      }}
    >
      <div>
        <EditButton small nochangeonsmall onClick={handleClickOpen}>
          <FaEdit size="30px" />
        </EditButton>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="edit-profile-dialog-slide-title"
          aria-describedby="edit-profile-dialog-slide-description"
        >
          <DialogContent>
            <EditImageForm user={user} />
          </DialogContent>
        </Dialog>
      </div>
    </IconContext.Provider>
  );
}

function EditImageForm({ user }) {
  const [profileImg, setProfileImg] = useState("");
  const dispatch = useDispatch();

  const onFileChange = (e) => {
    setProfileImg(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("photo_name", profileImg.name);
    formData.append("photo", profileImg);

    PhotoAPI.upload(formData).then(
      (response) => {
        console.log(response);
        dispatch(profilePicSet(response.data.photo_id));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <FormPaper>
      {/** */}
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <br />
        <div>
          <FileInput type="file" required onChange={onFileChange} />
        </div>
        <br />
        <ProfileControls>
          <Button type="submit" fullWidth primary>
            Upload
          </Button>
        </ProfileControls>
      </form>
    </FormPaper>
  );
}
