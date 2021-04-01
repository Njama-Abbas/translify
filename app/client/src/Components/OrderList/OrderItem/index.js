import React from "react";
import { OrderContainer, OrderItemHeader, OrderDestination } from "./elements";

const OrderItem = ({ order, SET_ACTIVE_INDEX }) => {
  const formatMoveType = (moveType) =>
    moveType === "hm"
      ? "House Moving"
      : moveType === "om"
      ? "Office Moving"
      : "Freight";

  return (
    <OrderContainer elevation={6} onClick={() => SET_ACTIVE_INDEX(order._id)}>
      <OrderItemHeader>{formatMoveType(order.moveType)}</OrderItemHeader>
      <OrderDestination>{order.destination.address}</OrderDestination>
    </OrderContainer>
  );
};

export default OrderItem;
