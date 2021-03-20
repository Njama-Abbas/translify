import React, { Fragment, useEffect, useState } from "react";
import { Footer, OrderForm, Price } from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "../Client/client.elements";
import { Button, Container } from "../../Resources/Styles/global";
import { Grid } from "@material-ui/core";

import {
  getDrivers,
  selectAllDrivers,
  selectDriversStatus,
  selectDesignatedDriver,
} from "../../State/drivers.slice";

import { useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { addNewOrder, ordersFilterChanged } from "../../State/orders.slice";

import DriverListItem from "../../Components/DriverListItem";
import {
  selectDestination,
  selectPickUp,
  selectLoad,
  locationUpdated,
  selectMoveType,
} from "../../State/navigation.slice";
import { AuthAPI } from "../../Api";
import calcPriceFromLatLng from "../../Resources/Utils/price";
import { DriverBox, DriverBoxHeader, ErrorNotification } from "./elements";

export default function OrderTruck() {
  const client = AuthAPI.getCurrentUser();
  const dispatch = useDispatch();
  const drivers_status = useSelector(selectDriversStatus);
  const drivers = useSelector(selectAllDrivers);
  const designatedDriver = useSelector(selectDesignatedDriver);
  const pickup = useSelector(selectPickUp);
  const destination = useSelector(selectDestination);
  const load = useSelector(selectLoad);
  const moveType = useSelector(selectMoveType);
  const history = useHistory();

  const [proceedRequestStatus, setProceedRequestStatus] = useState("idle");

  const canProceed = proceedRequestStatus === "idle";

  const handleOrderRequest = async () => {
    if (canProceed) {
      try {
        setProceedRequestStatus("pending");
        const orderObj = {
          moveType,
          clientId: client.id,
          driverId: designatedDriver.id,
          load,
          pickup,
          destination,
          charges: calcPriceFromLatLng(pickup, destination, load),
        };
        const resultAction = await dispatch(addNewOrder(orderObj));
        unwrapResult(resultAction);
        dispatch(ordersFilterChanged("pending"));
        history.push("/client#orders");
      } catch (err) {
        console.error("Failed to save the order: ", err);
      } finally {
        setProceedRequestStatus("idle");
        dispatch(locationUpdated({ inputType: "pickup", details: null }));
        dispatch(locationUpdated({ inputType: "destination", details: null }));
      }
    }
  };

  useEffect(() => {
    if (drivers_status === "idle") {
      dispatch(getDrivers());
    }
  }, [dispatch, drivers_status]);

  let content;

  if (drivers_status === "loading") {
    content = <div>Loading....</div>;
  } else if (drivers_status === "succeeded") {
    content = (
      <DriverBox>
        {drivers.length ? (
          <div>
            <DriverBoxHeader>Please Select A Driver</DriverBoxHeader>
            {drivers.map((driver) => (
              <DriverListItem driver={driver} key={driver.id} />
            ))}
            <Button>Procceed to Pay</Button>
          </div>
        ) : (
          <ErrorNotification>
            No Drivers Around Place of pickup
          </ErrorNotification>
        )}
      </DriverBox>
    );
  } else if (drivers_status === "failed") {
    content = <div>An error occured</div>;
  }

  if (!client) {
    return <div>You need to log in</div>;
  }

  return (
    <Fragment>
      <Box>
        <Container
          style={{
            minHeight: "100vh",
          }}
        >
          <Grid container spacing={2} justify="center" alignContent="center">
            <Grid item xs={12} sm={6} md={6}>
              <OrderForm />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Grid container direction="column">
                <Grid item>
                  <Price />
                </Grid>
                <Grid item>{content}</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Fragment>
  );
}
