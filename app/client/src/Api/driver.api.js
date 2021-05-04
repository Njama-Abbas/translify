import axios from "axios";
import { BASE_URL } from "./api.config";

const API_URL = BASE_URL + "driver/";

class DriverAPI {
  getDriverById(driverid) {
    return axios.get(API_URL + "findone", {
      headers: {
        driverid,
      },
    });
  }

  complete_registration(userId, truckno, dlno, address) {
    return axios.post(API_URL + "complete-registration", {
      userId,
      truckno,
      dlno,
      address,
    });
  }

  check_approval(userid) {
    return axios.get(API_URL + "check-approval", {
      headers: {
        userid,
      },
    });
  }

  check_account_status(userid) {
    return axios.get(API_URL + "check-account-status", {
      headers: {
        userid,
      },
    });
  }

  getOnCall() {
    return axios.get(API_URL + "on-call");
  }

  checkDutyStatus(userid) {
    return axios.get(API_URL + "duty-status", {
      headers: {
        userid,
      },
    });
  }

  changeDutyStaus(userId, duty_status) {
    return axios.post(API_URL + "duty-status", {
      userId,
      duty_status,
    });
  }
}

export default new DriverAPI();
