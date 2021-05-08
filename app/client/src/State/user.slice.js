import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  accesstoken: null,
  status: "idle",
  error: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userSet(state, action) {
      state.data = action.payload;
    },
    accessTokenSet(state, action) {
      state.accesstoken = action.payload;
    },
    userVerified(state, action) {
      state.user.verified = action.payload;
    },
    profilePicSet(state, action) {
      state.user.profilePic = action.payload;
    },
  },
});

export const {
  userSet,
  userVerified,
  profilePicSet,
  accessTokenSet,
} = UserSlice.actions;

export const selectUser = (state) => state.user.data;
export const selectUserStatus = (state) => state.user.status;
export const selectAccessToken = (state) => state.user.accesstoken;

export default UserSlice.reducer;
