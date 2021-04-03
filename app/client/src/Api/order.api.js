import axios from "axios";
import { BASE_URL } from "./api.config";

const API_URL = BASE_URL + "orders/";

class OrderAPI {
  getAllOrders(userid) {
    return axios.get(API_URL + "user", {
      headers: {
        userid,
      },
    });
  }

  addNewOrder(orderDetails) {
    const {
      moveType,
      clientId,
      driverId,
      pickup,
      destination,
      load,
      charges,
    } = orderDetails;

    return axios.post(API_URL + "create", {
      moveType,
      clientId,
      driverId,
      pickup,
      destination,
      load,
      charges,
    });
  }

  updateOrder(order) {
    const { OID, status, UID } = order;
    return axios.post(API_URL + "update", {
      OID,
      status,
      UID,
    });
  }
}

export default new OrderAPI();
