import React from "react";
import { OrderContainer, OrderItemHeader, OrderItemRow } from "./elements";
import { useDispatch } from "react-redux";
import { Button } from "../../../Resources/Styles/global";
import ViewOrderDetailsDialog from "../OrderDetails";
import {
  updateOrder,
  ordersFilterChanged,
  orderReviewed,
} from "../../../State/orders.slice";

import Grid from "@material-ui/core/Grid";
import TrackOrderDialog from "../../MapView";
const OrderItem = ({ order, user }) => {
  const formatMoveType = (moveType) =>
    moveType === "hm"
      ? "House Moving"
      : moveType === "om"
      ? "Office Moving"
      : "Freight";

  const OID = order.id;
  const UID = user.id;
  const dispatch = useDispatch();

  const OrderUpdate = (status) => {
    dispatch(updateOrder({ OID, status, UID }));
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

  const handleOrderReview = (grade) => {
    dispatch(orderReviewed({ UID, OID, grade }));
  };
  return (
    <OrderContainer elevation={6}>
      <Grid container justify="space-between">
        <Grid item xs={12} sm={6}>
          <Grid container justify="center" direction="column">
            <Grid item>
              <OrderItemHeader>
                {user.role === "client"
                  ? ` ${order.driver.firstname} ${order.driver.lastname}`
                  : user.role === "driver"
                  ? `${order.client.firstname} ${order.client.lastname}`
                  : null}
              </OrderItemHeader>
            </Grid>
            <Grid item>
              <OrderItemRow>{formatMoveType(order.moveType)}</OrderItemRow>
            </Grid>
          </Grid>
          <Grid item>
            <OrderItemRow>{order.destination.address}</OrderItemRow>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={1} justify="center" alignItems="center">
            {order.status === "pending" ? (
              user.role === "driver" ? (
                <React.Fragment>
                  <Grid item>
                    <Button small primary onClick={handleOrderAccept}>
                      Accept
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button small warning onClick={handleOrderCancel}>
                      Decline
                    </Button>
                  </Grid>
                </React.Fragment>
              ) : (
                <Grid item>
                  <Button small warning onClick={handleOrderCancel}>
                    Cancel
                  </Button>
                </Grid>
              )
            ) : order.status === "in-progress" && user.role === "driver" ? (
              <Grid item>
                <Button warning small onClick={handleOrderComplete}>
                  complete
                </Button>
              </Grid>
            ) : order.status === "in-progress" && user.role === "client" ? (
              <TrackOrderDialog
                directions={{
                  origin: {
                    lat: order.pickup.latlng.lat,
                    lng: order.pickup.latlng.lng,
                  },
                  destination: {
                    lat: order.destination.latlng.lat,
                    lng: order.destination.latlng.lat,
                  },
                }}
              />
            ) : null}

            <Grid item>
              <ViewOrderDetailsDialog
                user={user}
                order={order}
                controls={{
                  cancel: handleOrderCancel,
                  accept: handleOrderAccept,
                  complete: handleOrderComplete,
                  review: handleOrderReview,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </OrderContainer>
  );
};

export default OrderItem;
