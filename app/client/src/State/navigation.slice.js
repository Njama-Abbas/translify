import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pickup: null,
  destination: null,
  load: 1,
  moveType: "fr",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    locationUpdated(state, action) {
      const { inputType, details } = action.payload;
      state[inputType] = details;
    },
    loadSelected(state, action) {
      state.load = action.payload;
    },
    moveTypeSelected(state, action) {
      state.moveType = action.payload;
    },
  },
});

export const {
  locationUpdated,
  loadSelected,
  moveTypeSelected,
} = navigationSlice.actions;

export const selectDestination = (state) => state.navigation.destination;
export const selectPickUp = (state) => state.navigation.pickup;
export const selectLoad = (state) => state.navigation.load;
export const selectMoveType = (state) => state.navigation.moveType;
export default navigationSlice.reducer;
