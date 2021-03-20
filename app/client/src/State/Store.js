import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./orders.slice";
import navigationReducer from "./navigation.slice";
import driversReducer from "./drivers.slice";

export default configureStore({
  reducer: {
    orders: ordersReducer,
    navigation: navigationReducer,
    drivers: driversReducer,
  },
});
