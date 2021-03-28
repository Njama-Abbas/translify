import axios from "axios";
import { BASE_URL } from "./api.config";

const API_URL = BASE_URL + "auth/";

class AuthAPI {
  login(email, password, role) {
    return axios
      .post(API_URL + "signin", {
        email,
        password,
        role,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(firstname, lastname, email, phoneno, password, role) {
    return axios.post(API_URL + "signup", {
      firstname,
      lastname,
      email,
      phoneno,
      password,
      role,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  verify(ID, v_code) {
    return axios
      .post(API_URL + "verify-account", {
        ID,
        v_code,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  resendVerificationCode(userID) {
    return axios.post(API_URL + "resend-vcode", {
      userID,
    });
  }
}

export default new AuthAPI();
