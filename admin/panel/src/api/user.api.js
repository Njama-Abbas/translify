import axios from "axios";
import authHeader from "./auth-header";
import { BASE_URL } from "./config";

const API_URL = BASE_URL + "user/";

class UserAPI {
  getPublicContent() {
    return axios.get(API_URL + "public");
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
}

export default new UserAPI();
