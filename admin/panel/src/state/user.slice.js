import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: null,
    phoneno: null,
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
      const { id, phoneno } = action.payload;
      state.user.id = id;
      state.user.phoneno = phoneno;
    },
    profilePicSet(state, action) {
      state.user.profilePic = action.payload;
    },
  },
});

export const { userSet, profilePicSet } = UserSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectUserStatus = (state) => state.user.status;

export default UserSlice.reducer;
