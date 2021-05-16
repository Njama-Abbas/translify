import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DriverAPI } from "../api";
import _ from "lodash";
const initialState = {
  list: [],
  status: "idle",
  error: null,
};

const sort_ = (a, b) =>
  a.approval_status < b.approval_status
    ? 1
    : a.approval_status > b.approval_status
    ? -1
    : 0;

const PendingFirst = (arr) => arr.sort(sort_);

export const fetchDrivers = createAsyncThunk("/drivers/fetch", async () => {
  let response = await DriverAPI.fetch();
  return response.data;
});

export const updateStatus = createAsyncThunk(
  "/drivers/update",
  async (data) => {
    let response = await DriverAPI.updateStatus(data.id, data.status);
    return response.data;
  }
);

export const changeApprovalStatus = createAsyncThunk(
  "/drivers/approve",
  async (data) => {
    let response = await DriverAPI.changeApproval(data.id, data.status);
    return response.data;
  }
);

export const deleteDriver = createAsyncThunk("/drivers/delete", async (id) => {
  await DriverAPI.delete(id);
  return id;
});

const driverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchDrivers.pending]: (state, action) => {
      state.status = "pending";
    },
    [fetchDrivers.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.list = PendingFirst(action.payload);
    },
    [fetchDrivers.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [updateStatus.pending]: (state, action) => {
      state.status = "pending";
    },
    [updateStatus.fulfilled]: (state, action) => {
      const { id } = action.payload;
      const updatedIndex = _.findIndex(state.list, (user) => user.id === id);
      state.list[updatedIndex] = action.payload;
      state.status = "succeeded";
    },
    [updateStatus.rejected]: (state, action) => {
      state.error = action.payload;
    },
    [deleteDriver.pending]: (state, action) => {
      state.status = "pendng";
    },
    [deleteDriver.fulfilled]: (state, action) => {
      const new_list = state.list.filter(
        (driver) => driver.id !== action.payload
      );
      state.list = PendingFirst(new_list);
      state.status = "succeeded";
    },
    [changeApprovalStatus.pending]: (state, action) => {
      state.status = "pendng";
    },
    [changeApprovalStatus.fulfilled]: (state, action) => {
      const { id } = action.payload;
      const updatedIndex = _.findIndex(state.list, (user) => user.id === id);
      state.list[updatedIndex] = action.payload;
      state.status = "succeeded";
    },
    [changeApprovalStatus.rejected]: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const selectPending = (state) =>
  state.drivers.list.filter((x) => x.approval_status === "Pending");

export default driverSlice.reducer;
