import axios from "axios";
import { BASE_URL } from "./config";

const api = BASE_URL + "drivers/";
class DriverAPI {
  fetch() {
    return axios.get(api);
  }

  get(id) {
    return axios.get(api + `${id}`);
  }

  delete(id) {
    return axios.delete(api + `${id}`);
  }
  changeApproval(driverId, status) {
    return axios.post(api + "approve", {
      driverId,
      status,
    });
  }
  updateStatus(id, status) {
    return axios.post(api + "update_status", {
      id,
      status,
    });
  }
}

export default new DriverAPI();
