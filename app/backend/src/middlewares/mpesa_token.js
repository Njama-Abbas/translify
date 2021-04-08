const axios = require("axios").default;

const CONSUMERKEY = "YOUR COMSUMER KEY";
const CONSUMERSECRET = "YOUR CONSUMER SECRET";

module.exports = {
  reqMpesaToken: (req, res, next) => {
    const endpoint =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth =
      "Basic " +
      Buffer.from(CONSUMERKEY + ":" + CONSUMERSECRET).toString("base64");

    axios
      .get(endpoint, {
        headers: {
          Authorization: auth,
        },
      })
      .then((response) => {
        req.mpesa_token = response.data.access_token;
        next();
      })
      .catch((err) => {
        res.status(500).json(err);
        next(err);
      });
  },
};
