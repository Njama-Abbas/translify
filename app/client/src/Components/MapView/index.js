import React from "react";
import {
  DirectionsRenderer,
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";

import { Button } from "../../Resources/Styles/global";
import { Dialog, DialogContent, Slide } from "@material-ui/core";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TrackOrderDialog({ directions }) {
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
        Track Your Goods
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="track-dialog-slide-title"
        aria-describedby="track-dialog-slide-description"
        style={{
          minWidth: "400px",
          margin: "auto",
        }}
      >
        <DialogContent>
          <MapView directions={directions} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const MapView = ({ directions }) => {
  const GoogleMapExample = withGoogleMap((props) => (
    <GoogleMap
      defaultCenter={{
        lat: directions.origin.lat,
        lng: directions.origin.lng,
      }}
      defaultZoom={13}
    >
      <DirectionsRenderer directions={props.directions} />
    </GoogleMap>
  ));
  return (
    <div>
      <GoogleMapExample
        containerElement={<div style={{ height: `500px`, width: "500px" }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
};
