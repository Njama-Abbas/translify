import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencyToString } from "../../Resources/Utils/price";

import {
  updateOrder,
  ordersFilterChanged,
  selectActiveOrder,
} from "../../State/orders.slice";

import { Button } from "../../Resources/Styles/global";

import {
  OrderDetailsContainer,
  OrderDetailsHeader,
  OrderColumn,
  OrderItem,
  OrderValue,
  OrderStatus,
} from "./elements";

const OrderDetails = ({ user }) => {
  const order = useSelector(selectActiveOrder);
  const id = order.id;
  const dispatch = useDispatch();

  const OrderUpdate = (status) => {
    dispatch(updateOrder({ id, status }));
  };

  const handleOrderCancel = () => {
    OrderUpdate("cancelled");
    dispatch(ordersFilterChanged("cancelled"));
  };

  const handleOrderAccept = () => {
    OrderUpdate("in-progress");
    dispatch(ordersFilterChanged("in-progress"));
  };

  const handleOrderComplete = () => {
    OrderUpdate("successfull");
    dispatch(ordersFilterChanged("successfull"));
  };

  if (!order) {
    return null;
  }

  return (
    <OrderDetailsContainer>
      <OrderDetailsHeader>translify</OrderDetailsHeader>
      <OrderColumn>
        <OrderItem>Order No:</OrderItem>
        <OrderValue>
          {id.slice(0, 4)}
          {id.slice(-4)}
        </OrderValue>
      </OrderColumn>
      <OrderColumn>
        <OrderItem>Pick Up: </OrderItem>
        <OrderValue>{order.pickup.address}</OrderValue>
      </OrderColumn>
      <OrderColumn>
        <OrderItem> Destination: </OrderItem>
        <OrderValue>{order.destination.address}</OrderValue>
      </OrderColumn>
      <OrderColumn>
        <OrderItem>Charges: </OrderItem>
        <OrderValue
          style={{
            letterSpacing: "3px",
          }}
        >
          Ksh:&nbsp;{currencyToString(order.charges)}
        </OrderValue>
      </OrderColumn>
      {user.role === "client" ? (
        <OrderColumn>
          <OrderItem>Driver</OrderItem>
          <OrderValue>
            {order.driver.firstname} - {order.driver.truckno}
          </OrderValue>
        </OrderColumn>
      ) : user.role === "driver" ? (
        <OrderColumn>
          <OrderItem>Client</OrderItem>
          <OrderValue>
            {order.client.firstname}&nbsp;{order.client.lastname}
          </OrderValue>
        </OrderColumn>
      ) : null}

      <OrderColumn>
        <OrderItem>Date: </OrderItem>
        <OrderValue>{new Date(order.orderDate).toLocaleString()}</OrderValue>
      </OrderColumn>
      <OrderColumn>
        <OrderItem>Status: </OrderItem>
        <OrderStatus>{order.status}</OrderStatus>
      </OrderColumn>
      {order.status === "pending" &&
        (user.role === "driver" ? (
          <OrderColumn>
            <Button primary onClick={handleOrderAccept}>
              Accept
            </Button>
            <Button primary>Decline</Button>
          </OrderColumn>
        ) : (
          user.role === "client" && (
            <OrderColumn>
              <Button onClick={handleOrderCancel}>Cancel</Button>
            </OrderColumn>
          )
        ))}
      {order.status === "in-progress" && (
        <OrderColumn>
          <Button onClick={handleOrderComplete}>Complete Trip</Button>
        </OrderColumn>
      )}
    </OrderDetailsContainer>
  );
};

export default OrderDetails;
