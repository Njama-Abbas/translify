import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { AuthAPI, PhotoAPI } from "../../Api";

import {
  ProfileImage,
  Container,
  EditButton,
  Wrapper,
  FileInput,
  FormPaper,
  ProfileControls,
  ProfileLoaderContainer,
} from "./elements";
import LoadingComponent from "../LoadingComponent";

import imagePlaceHolder from "../../Resources/Images/undraw_profile_pic.svg";
import { IconContext } from "react-icons/lib";
import { Dialog, DialogContent, Slide } from "@material-ui/core";
import { Button } from "../../Resources/Styles/global";
import { FaEdit } from "react-icons/fa";

export default function FileUploadComponent() {
  const [profilePhotoID, setProfilePhotoID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = AuthAPI.getCurrentUser();
  const { addToast } = useToasts();

  useEffect(() => {
    PhotoAPI.getProfileID(user.id).then(
      (response) => {
        setProfilePhotoID(response.data.photo_id);
      },
      (error) => {
        if (error.response) {
          if (error.response.status !== 404) {
            addToast(
              `An error occured while fetching
      profile picture please try angain letter`,
              {
                appearance: "error",
              }
            );
          }
        }
      }
    );
  }, [addToast, user.id]);

  const handleProfilePicChange = (id) => {
    setProfilePhotoID(id);
  };

  const setLoading = (state) => {
    setIsLoading(state);
  };

  let content;

  if (isLoading) {
    content = (
      <ProfileLoaderContainer>
        <LoadingComponent small message="Updating your details.." />;
      </ProfileLoaderContainer>
    );
  } else {
    content = (
      <Container>
        <Wrapper>
          <ProfileImage
            src={
              profilePhotoID && !isLoading
                ? `http://localhost:801/api/photos/${profilePhotoID}`
                : imagePlaceHolder
            }
          />
          <EditImageDialog
            user={user}
            updateProfilePic={handleProfilePicChange}
            setLoading={setLoading}
          />
        </Wrapper>
      </Container>
    );
  }
  return content;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditImageDialog({ user, updateProfilePic, setLoading }) {
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
            <EditImageForm
              user={user}
              updateProfilePic={updateProfilePic}
              setLoading={setLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </IconContext.Provider>
  );
}

function EditImageForm({ user, updateProfilePic, setLoading }) {
  const [profileImg, setProfileImg] = useState("");
  const { addToast } = useToasts();

  const onFileChange = (e) => {
    setProfileImg(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("photo_name", profileImg.name);
    formData.append("photo", profileImg);

    PhotoAPI.upload(formData).then(
      (response) => {
        updateProfilePic(response.data.photo_id);
        addToast(
          `Profile picture updated It might take
          a while To reflect the changes.
            `,
          {
            appearance: "error",
          }
        );
        setLoading(false);
      },
      (error) => {
        console.log(error);
        addToast(
          `An error occured, cannot change profile picture,
            please try angain letter`,
          {
            appearance: "error",
          }
        );
        setLoading(false);
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
