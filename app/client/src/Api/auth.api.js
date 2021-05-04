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

  updateInfo(userId, data) {
    return axios.put(API_URL + "update-info", {
      userId,
      data,
    });
  }

  getPasswordChangeAuthCode(userId, currentPassword) {
    return axios.post(API_URL + "change-password-auth", {
      userId,
      currentPassword,
    });
  }

  changePassword(userId, newPassword, v_code) {
    return axios.post(API_URL + "change-password", {
      userId,
      newPassword,
      v_code,
    });
  }
  getPasswordResetAuthCode(phoneno) {
    return axios.post(API_URL + "reset-password-auth", {
      phoneno,
    });
  }

  resetPassword(userId, auth_code, newPassword) {
    return axios.post(API_URL + "reset-password", {
      userId,
      auth_code,
      newPassword,
    });
  }
}

export default new AuthAPI();
