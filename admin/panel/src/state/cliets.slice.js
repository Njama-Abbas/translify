import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ClientAPI } from "../api";
import _ from "lodash";
const initialState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchClients = createAsyncThunk("/clients/fetch", async () => {
  let response = await ClientAPI.fetch();
  return response.data;
});

export const updateStatus = createAsyncThunk(
  "/clients/update",
  async (data) => {
    let response = await ClientAPI.updateStatus(data.id, data.status);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk("/clients/delete", async (id) => {
  await ClientAPI.delete(id);
  return id;
});

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchClients.pending]: (state, action) => {
      state.status = "pending";
    },
    [fetchClients.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.list = action.payload;
    },
    [fetchClients.rejected]: (state, action) => {
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
    [deleteUser.pending]: (state, action) => {
      state.status = "pendng";
    },
    [deleteUser.fulfilled]: (state, action) => {
      const new_list = state.list.filter((user) => user.id !== action.payload);
      state.list = new_list;
      state.status = "succeeded";
    },
  },
});

export default clientSlice.reducer;
