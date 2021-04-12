import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    ID: null,
    phoneno: null,
    verified: false,
    profilePic: null,
  },
  status: "idle",
  error: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userSet(state, action) {
      const { UID, phoneno } = action.payload;
      state.user.ID = UID;
      state.user.phoneno = phoneno;
    },
    userVerified(state, action) {
      state.user.verified = action.payload;
    },
    profilePicSet(state, action) {
      state.user.profilePic = action.payload;
    },
  },
});

export const { userSet, userVerified, profilePicSet } = UserSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectUserStatus = (state) => state.user.status;

export default UserSlice.reducer;
