import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthAPI } from "../Api";

const initialState = {
  user: {
    UID: null,
    phoneno: null,
    verified: false,
  },
  status: "idle",
  error: null,
};

const verifyUser = createAsyncThunk("user/verify", async (user) => {
  const response = await AuthAPI.verify(user);
  return response.data.v_status;
});

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userSet(state, action) {
      const { UID, phoneno } = action.payload;
      state.user.UID = UID;
      state.user.phoneno = phoneno;
    },
    userVerified(state, action) {
      state.user.verified = action.payload;
    },
  },
  extraReducers: {
    [verifyUser.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [verifyUser.pending]: (state, action) => {
      state.status = "loading";
    },
    [verifyUser.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.user.verified = action.payload;
    },
  },
});

export const { userSet, userVerified } = UserSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectUserStatus = (state) => state.user.status;

export default UserSlice.reducer;
