import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DriverAPI } from "../Api";

const initialState = {
  drivers: [],
  designated: {},
  status: "idle",
  error: null,
};

export const getDrivers = createAsyncThunk("drivers/getoncall", async () => {
  const response = await DriverAPI.getOnCall();
  return response.data;
});

const DriversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    designatedDriverChanged(state, action) {
      state.designated = action.payload;
    },
  },
  extraReducers: {
    [getDrivers.pending]: (state, action) => {
      state.status = "loading";
    },
    [getDrivers.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [getDrivers.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.drivers = action.payload;
      state.designated = state.drivers[0];
    },
  },
});
export const { designatedDriverChanged } = DriversSlice.actions;
export const selectDriversStatus = (state) => state.drivers.status;
export const selectAllDrivers = (state) => state.drivers.drivers;
export const selectDesignatedDriver = (state) => state.drivers.designated;

export default DriversSlice.reducer;
