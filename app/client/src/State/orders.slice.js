import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthAPI, OrderAPI } from "../Api";
import SORT from "../Resources/Utils/sort";

const initialState = {
  orders: [],
  status: "idle",
  error: null,
  filter: "in-progress",
  sortOrder: "date",
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const user = AuthAPI.getCurrentUser();
  const response = await OrderAPI.getAllOrders(user.id);
  return response.data;
});

export const addNewOrder = createAsyncThunk(
  "orders/create",
  async (order_details) => {
    const response = await OrderAPI.addNewOrder(order_details);
    return response.data;
  }
);

export const updateOrder = createAsyncThunk("orders/update", async (order) => {
  const response = await OrderAPI.updateOrder(order);
  return response.data;
});

export const orderReviewed = createAsyncThunk("orders/review", async (data) => {
  const response = await OrderAPI.reveiewOrder(data.UID, data.grade, data.OID);
  return response.data;
});

const OrdersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    ordersFilterChanged(state, action) {
      state.filter = action.payload;
    },
    ordersSortOrderChanged(state, action) {
      state.sortOrder = action.payload;
      state.orders = SORT(state.orders, state.sortOrder);
    },
  },
  extraReducers: {
    [fetchOrders.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchOrders.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.orders = action.payload;
    },
    [fetchOrders.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [addNewOrder.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.orders.push(action.payload);
    },
    [updateOrder.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.orders = action.payload;
    },
    [orderReviewed.fulfilled]: (state, action) => {
      let reviewedIndex = state.orders.findIndex(
        (order) => order.id === action.payload.id
      );
      state.orders[reviewedIndex] = action.payload;
    },
  },
});

export const {
  ordersFilterChanged,
  activeOrderChanged,
  ordersSortOrderChanged,
} = OrdersSlice.actions;

export const selectAllOrders = (state) => state.orders.orders;

export const selectOrders = (state) => {
  return state.orders.orders.filter(
    (order) => order.status === state.orders.filter
  );
};

export const selectOrderById = (state, orderId) =>
  state.orders.orders.find((order) => order._id === orderId);

export const selectFilter = (state) => state.orders.filter;

export const selectSortOrder = (state) => state.orders.sortOrder;

export default OrdersSlice.reducer;
