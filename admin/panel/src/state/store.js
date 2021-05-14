import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./cliets.slice";
import driversReducer from "./driver.slice";
import usersReducer from "./user.slice";

export default configureStore({
  reducer: {
    clients: clientsReducer,
    drivers: driversReducer,
    user: usersReducer,
  },
});
