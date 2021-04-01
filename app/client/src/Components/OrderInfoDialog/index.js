import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Dialog, DialogContent, Slide, Container } from "@material-ui/core";

import { Button } from "../../Resources/Styles/global";

import {
  InfoPaper,
  CardHeader,
  OrderInfoItem,
  OrderInfoWraper,
  OrderInfoLabel,
} from "./elements";

import { selectDesignatedDriver } from "../../State/drivers.slice";
import calcPriceFromLatLng, {
  currencyToString,
} from "../../Resources/Utils/price";
import formatWeight from "../../Resources/Utils/weight";
import {
  selectDestination,
  selectPickUp,
  selectLoad,
  selectMoveType,
} from "../../State/navigation.slice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderInfoDialog = () => {
  const [open, setOpen] = useState(false);
  const designatedDriver = useSelector(selectDesignatedDriver);
  const destination = useSelector(selectDestination);
  const moveType = useSelector(selectMoveType);
  const pickup = useSelector(selectPickUp);
  const load = useSelector(selectLoad);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const OrderInfo = (
    <Container component="main" maxWidth="xs">
      <InfoPaper>
        <CardHeader>
          Take a moment to confirm your <b>Order</b>
        </CardHeader>
        <OrderInfoWraper>
          <OrderInfoLabel>Cost&nbsp;:</OrderInfoLabel>
          <OrderInfoItem colored>
            Ksh&nbsp;
            {currencyToString(calcPriceFromLatLng(pickup, destination, load))}
          </OrderInfoItem>
        </OrderInfoWraper>

        <OrderInfoWraper>
          <OrderInfoLabel>From&nbsp;:</OrderInfoLabel>
          <OrderInfoItem>{pickup.address}</OrderInfoItem>
        </OrderInfoWraper>

        <OrderInfoWraper>
          <OrderInfoLabel>To&nbsp;:</OrderInfoLabel>
          <OrderInfoItem>{destination.address}</OrderInfoItem>
        </OrderInfoWraper>
        <OrderInfoWraper>
          <OrderInfoLabel>Weight&nbsp;:</OrderInfoLabel>
          <OrderInfoItem>{formatWeight(load, moveType)}</OrderInfoItem>
        </OrderInfoWraper>

        <OrderInfoWraper>
          <OrderInfoLabel>Driver&nbsp;:</OrderInfoLabel>
          <OrderInfoItem colored>
            {designatedDriver.firstname}&nbsp;{designatedDriver.lastname}&nbsp;
            <b>{designatedDriver.truckno}</b>
          </OrderInfoItem>
        </OrderInfoWraper>

        <OrderInfoWraper
          style={{
            borderBottom: "none",
          }}
        >
          <Button warning onClick={handleClose}>
            Go Back
          </Button>
          <Button primary>Mpesa Pay</Button>
        </OrderInfoWraper>
      </InfoPaper>
    </Container>
  );

  return (
    <div>
      <Button fullWidth onClick={handleClickOpen}>
        Proceed to Pay
      </Button>
      <Dialog
        open={open}
        disableBackdropClick
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="order-info-dialog-slide-title"
        aria-describedby="order-info-dialog-slide-description"
      >
        <DialogContent>{OrderInfo}</DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderInfoDialog;
