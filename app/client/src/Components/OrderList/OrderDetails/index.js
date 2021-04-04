import React from "react";
import { currencyToString } from "../../../Resources/Utils/price";
import {
  OrderDetailsContainer,
  OrderDetailsHeader,
  OrderColumn,
  OrderItem,
  OrderValue,
  OrderStatus,
} from "./elements";

import { Button } from "../../../Resources/Styles/global";

import { Dialog, DialogContent, Slide } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderDetails = ({ user, close, order, controls }) => {
  const id = order.id;
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
            <Button small primary onClick={controls.accept}>
              Accept
            </Button>
            <Button small warning primary onClick={controls.cancel}>
              Decline
            </Button>
            <Button small secondary onClick={close}>
              Exit
            </Button>
          </OrderColumn>
        ) : (
          user.role === "client" && (
            <OrderColumn>
              <Button small warning onClick={controls.cancel}>
                Cancel
              </Button>
              <Button small secondary onClick={close}>
                Exit
              </Button>
            </OrderColumn>
          )
        ))}

      {order.status === "in-progress" && user.role === "driver" ? (
        <OrderColumn>
          <Button warning small onClick={controls.complete}>
            Complete
          </Button>
          <Button small secondary onClick={close}>
            Exit
          </Button>
        </OrderColumn>
      ) : (
        <Button small secondary onClick={close}>
          Exit
        </Button>
      )}
    </OrderDetailsContainer>
  );
};

export default function ViewOrderDetailsDialog({ user, order, controls }) {
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
          <OrderDetails
            user={user}
            order={order}
            close={handleClose}
            controls={controls}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
