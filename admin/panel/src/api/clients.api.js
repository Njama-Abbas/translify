import axios from "axios";
import { BASE_URL } from "./config";

const api = BASE_URL + "clients/";
class ClientApi {
  fetch() {
    return axios.get(api);
  }

  get(id) {
    return axios.get(api + `${id}`);
  }

  delete(id) {
    return axios.delete(api + `${id}`);
  }

  updateStatus(userId, status) {
    return axios.post(api + "update_status", {
      userId,
      status,
    });
  }
}

export default new ClientApi();
