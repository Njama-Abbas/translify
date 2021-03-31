import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

import DriverListItem from "./DriverListItem";
import {
  getDrivers,
  selectAllDrivers,
  selectDriversStatus,
  selectDesignatedDriver,
  designatedDriverChanged,
} from "../../State/drivers.slice";
import {
  DriverListContainer,
  DriverListHeader,
  DriverListItems,
  ErrorNotification,
} from "./elements";

const DriverList = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const drivers_status = useSelector(selectDriversStatus);
  const drivers = useSelector(selectAllDrivers);
  const designatedDriver = useSelector(selectDesignatedDriver);

  useEffect(() => {
    if (drivers_status === "idle") {
      dispatch(getDrivers());
    }
  }, [dispatch, drivers_status]);

  let content;

  const isDesignatedDriver = (id) => id === designatedDriver.id;

  const handleDesignatedDriverChange = (id) => {
    const driver = drivers.find((driver) => driver.id === id);
    dispatch(designatedDriverChanged(driver));
    addToast(
      `You selected ${driver.firstname} ${driver.lastname} To be your rider`,
      {
        appearance: "info",
      }
    );
  };

  if (drivers_status === "loading") {
    content = <div>Loading....</div>;
  } else if (drivers_status === "succeeded") {
    content = (
      <DriverListContainer>
        {drivers.length ? (
          <React.Fragment>
            <DriverListHeader>Please Select A Driver</DriverListHeader>
            <DriverListItems>
              {drivers.map((driver) => (
                <DriverListItem
                  driver={driver}
                  key={driver.id}
                  onclick={() => handleDesignatedDriverChange(driver.id)}
                  designated={isDesignatedDriver(driver.id)}
                />
              ))}
            </DriverListItems>
          </React.Fragment>
        ) : (
          <ErrorNotification>
            No Drivers Around Place of pickup
          </ErrorNotification>
        )}
      </DriverListContainer>
    );
  }

  return content;
};

export default DriverList;
