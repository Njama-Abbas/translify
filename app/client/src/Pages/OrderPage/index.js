import React, { Fragment, useEffect, useState } from "react";
import { Footer, LoadingComponent, OrderForm, Price } from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "../Client/client.elements";
import { Container } from "../../Resources/Styles/global";
import { Grid } from "@material-ui/core";

import {
  getDrivers,
  selectDriversStatus,
  selectDesignatedDriver,
} from "../../State/drivers.slice";

import { useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { addNewOrder, ordersFilterChanged } from "../../State/orders.slice";

import { DriverList, OrderInfoDialog } from "../../Components";

import {
  selectDestination,
  selectPickUp,
  selectLoad,
  locationUpdated,
  selectMoveType,
} from "../../State/navigation.slice";
import { AuthAPI } from "../../Api";
import calcPriceFromLatLng from "../../Resources/Utils/price";

export default function OrderTruck() {
  const client = AuthAPI.getCurrentUser();
  const dispatch = useDispatch();
  const drivers_status = useSelector(selectDriversStatus);
  const designatedDriver = useSelector(selectDesignatedDriver);
  const pickup = useSelector(selectPickUp);
  const destination = useSelector(selectDestination);
  const load = useSelector(selectLoad);
  const moveType = useSelector(selectMoveType);
  const history = useHistory();

  const [proceedRequestStatus, setProceedRequestStatus] = useState("idle");
  const [isLoading, setIsLoading] = useState(false);

  const canProceed = proceedRequestStatus === "idle";

  const canSave = [moveType, pickup, destination, load].every(Boolean);

  const handleOrderRequest = async () => {
    if (canProceed) {
      setIsLoading(true);
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
        dispatch(getDrivers());
        unwrapResult(resultAction);
        dispatch(ordersFilterChanged("pending"));
        setIsLoading(false);
        history.push("/client");
      } catch (err) {
        console.error("Failed to save the order: ", err);
      } finally {
        setProceedRequestStatus("idle");
        dispatch(locationUpdated({ inputType: "pickup", details: null }));
        dispatch(locationUpdated({ inputType: "destination", details: null }));
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (drivers_status === "idle") {
      dispatch(getDrivers());
    }
  }, [dispatch, drivers_status]);

  let content;

  if (!client) {
    content = <div>You need to log in</div>;
  } else if (isLoading) {
    content = <LoadingComponent />;
  } else {
    content = (
      <Fragment>
        <Box>
          <Container
            style={{
              minHeight: "100vh",
            }}
          >
            <Grid container spacing={2} justify="center" alignContent="center">
              <Grid item sm={12} md={6}>
                <OrderForm />
              </Grid>
              <Grid item sm={12} md={6}>
                {canSave ? (
                  <Grid container direction="column">
                    <Grid item xs={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "20px",
                        }}
                      >
                        <Price />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <DriverList />
                    </Grid>
                    <Grid item xs={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: "20px",
                        }}
                      >
                        <OrderInfoDialog
                          handleOrderRequest={handleOrderRequest}
                        />
                      </div>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Footer />
      </Fragment>
    );
  }
  return content;
}
