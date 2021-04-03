import React from "react";
import { useDispatch } from "react-redux";
import { currencyToString } from "../../../Resources/Utils/price";
import {
  OrderDetailsContainer,
  OrderDetailsHeader,
  OrderColumn,
  OrderItem,
  OrderValue,
  OrderStatus,
} from "./elements";

import { updateOrder, ordersFilterChanged } from "../../../State/orders.slice";

import { Button } from "../../../Resources/Styles/global";

import { Dialog, DialogContent, Slide } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderDetails = ({ user, close, order }) => {
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
        <OrderValue
          style={{
            textAlign: "right",
            textTransform: "uppercase",
          }}
        >
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
        <OrderValue>Ksh:&nbsp;{currencyToString(order.charges)}</OrderValue>
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
            <Button small primary onClick={handleOrderAccept}>
              Accept
            </Button>
            <Button small warning primary>
              Decline
            </Button>
            <Button small secondary onClick={close}>
              Exit
            </Button>
          </OrderColumn>
        ) : (
          user.role === "client" && (
            <OrderColumn>
              <Button small warning onClick={handleOrderCancel}>
                Cancel
              </Button>
              <Button small secondary onClick={close}>
                Exit
              </Button>
            </OrderColumn>
          )
        ))}

      {order.status === "in-progress" && (
        <OrderColumn>
          <Button small onClick={handleOrderComplete}>
            Complete Trip
          </Button>
          <Button small secondary onClick={handleOrderCancel}>
            Exit
          </Button>
        </OrderColumn>
      )}
    </OrderDetailsContainer>
  );
};

export default function ViewOrderDetailsDialog({ user, order }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button small onClick={handleClickOpen}>
        view
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="edit-info-dialog-slide-title"
        aria-describedby="edit-info-dialog-slide-description"
        style={{
          minWidth: "400px",
          margin: "auto",
        }}
      >
        <DialogContent>
          <OrderDetails user={user} order={order} close={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
