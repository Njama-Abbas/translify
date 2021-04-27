import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  selectOrders,
  fetchOrders,
  ordersFilterChanged,
  selectFilter,
  selectAllOrders,
} from "../../State/orders.slice";

import { LinkButton, Button } from "../../Resources/Styles/global";
import OrderItem from "./OrderItem";

import {
  MdAccessAlarm,
  MdWarning,
  MdImportExport,
  MdCheck,
} from "react-icons/md";
import { IconContext } from "react-icons/lib";

import {
  OrderCardContainer,
  OrderCardHeader,
  OrdersNav,
  FilterControlItem,
  FilterCount,
  FilterIcon,
  FilterText,
  Notification,
  Message,
  SortControlsContainer,
  SortText,
} from "./elements";

const Orders = ({ user }) => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const order_status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);
  const filter = useSelector(selectFilter);
  const allOrders = useSelector(selectAllOrders);

  const handleFilterChange = (filter) => dispatch(ordersFilterChanged(filter));

  const active_filter = (current_filter) => current_filter === filter;

  const countOrders = (f) => allOrders.filter((o) => o.status === f).length;

  useEffect(() => {
    if (order_status === "idle") {
      dispatch(fetchOrders());
    }
  }, [dispatch, order_status]);

  let content;

  if (order_status === "loading") {
    content = <div className="loader">Loading...</div>;
  } else if (order_status === "succeeded") {
    content = (
      <div>
        {orders.length ? (
          orders.map((order) => (
            <OrderItem order={order} user={user} key={order.id} />
          ))
        ) : (
          <Notification>
            <Message>No orders in this category</Message>
            <br />
            {user.role === "client" && (
              <LinkButton primary="true" to="/client/order-truck">
                Place Your Order
              </LinkButton>
            )}
          </Notification>
        )}
      </div>
    );
  } else if (order_status === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <IconContext.Provider
      value={{
        color: "#fff",
      }}
    >
      <div
        style={{
          height: "100vh",
          overflowY: "scroll",
        }}
      >
        <Grid container direction="column">
          <Grid item xs={12}>
            <OrderCardHeader>My Transits</OrderCardHeader>
          </Grid>
          <Grid item>
            <OrderCardContainer>
              <Grid container justify="space-evenly">
                <Grid item md={3} sm={8}>
                  <OrdersNav>
                    <FilterControlItem
                      selected={active_filter("pending")}
                      onClick={() => handleFilterChange("pending")}
                    >
                      <FilterIcon>
                        <MdAccessAlarm size="30px" />
                      </FilterIcon>
                      <FilterText>Pending</FilterText>
                      <FilterCount>{countOrders("pending")}</FilterCount>
                    </FilterControlItem>
                    <FilterControlItem
                      selected={active_filter("cancelled")}
                      onClick={() => handleFilterChange("cancelled")}
                    >
                      <FilterIcon>
                        <MdWarning size="30px" />
                      </FilterIcon>
                      <FilterText>Cancelled</FilterText>
                      <FilterCount>{countOrders("cancelled")}</FilterCount>
                    </FilterControlItem>
                    <FilterControlItem
                      selected={active_filter("in-progress")}
                      onClick={() => handleFilterChange("in-progress")}
                    >
                      <FilterIcon>
                        <MdImportExport size="30px" />
                      </FilterIcon>
                      <FilterText>InTransit</FilterText>
                      <FilterCount>{countOrders("in-progress")}</FilterCount>
                    </FilterControlItem>
                    <FilterControlItem
                      selected={active_filter("successfull")}
                      onClick={() => handleFilterChange("successfull")}
                    >
                      <FilterIcon>
                        <MdCheck size="30px" />
                      </FilterIcon>
                      <FilterText>Successfull</FilterText>
                      <FilterCount>{countOrders("successfull")}</FilterCount>
                    </FilterControlItem>
                  </OrdersNav>
                </Grid>
                <Grid item md={9} sm={12}>
                  <Grid container direction="column">
                    <SortControlsContainer>
                      <Grid item xs={12}>
                        <Grid
                          container
                          justify="space-evenly"
                          alignItems="center"
                        >
                          <Grid item>
                            <SortText>Filter By:</SortText>
                          </Grid>
                          <Grid item>
                            <Button primary small>
                              Date
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button primary small>
                              Destination
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button primary small>
                              Pickup
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button primary small>
                              Cost
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </SortControlsContainer>
                    <Grid item>{content}</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </OrderCardContainer>
          </Grid>
        </Grid>
      </div>
    </IconContext.Provider>
  );
};

export default Orders;
