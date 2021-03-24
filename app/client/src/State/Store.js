import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./orders.slice";
import navigationReducer from "./navigation.slice";
import driversReducer from "./drivers.slice";
import userReducer from "./user.slice";

export default configureStore({
  reducer: {
    orders: ordersReducer,
    navigation: navigationReducer,
    drivers: driversReducer,
    user: userReducer,
  },
});
