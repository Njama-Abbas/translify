import { BASE_URL } from "./api.config";
import axios from "axios";

const API_URL = BASE_URL + "photos";

class PhotoAPI {
  upload(formData) {
    return axios.post(API_URL + "/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  getProfileID(userid) {
    return axios.get(API_URL + "/img", {
      headers: {
        userid,
      },
    });
  }
}

export default new PhotoAPI();
