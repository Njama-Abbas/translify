const axios = require("axios").default;
const datetime = require("node-datetime");
const config = require("../config/auth.config");

const timeStamp = () => {
  const date = datetime.create();
  const timestamp = date.format("YmdHMS");
  return timestamp;
};

const generatePassword = () => {
  const passString =
    config.LIPA_NA_MPESA_SHORT_CODE +
    config.LIPA_NA_MPESA_PASS_KEY +
    timeStamp();
  const pwd = Buffer.from(passString).toString("base64");
  return pwd;
};

module.exports = {
  reqMpesaToken: (req, res, next) => {
    const endpoint =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth =
      "Basic " +
      Buffer.from(
        config.MPESA_CONSUMER_KEY + ":" + config.MPESA_CUSTOMER_SECRET
      ).toString("base64");

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
  mpesaPassword: (req, res) => {
    res.status(200).json({
      PWD: generatePassword(),
    });
  },
  stkPush: (req, res, next) => {
    const mpesa_token = req.mpesa_token;

    const endpoint =
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const auth = "Bearer " + mpesa_token;

    const headers = {
      Authorization: auth,
    };
    console.log(headers);

    let Password = generatePassword(),
      Timestamp = timeStamp();

    let data = {
      BusinessShortCode: "174379",
      Password,
      Timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: "1",
      PartyA: "254748717044",
      PartyB: "174379",
      PhoneNumber: "254748717044",
      CallBackURL: "http://{ipv4address}:801/callBack",
      AccountReference: "TRANSLIFY",
      TransactionDesc: "Lipa na mpesa",
    };

    axios
      .post(endpoint, data, {
        headers,
      })
      .then(
        (response) => {
          /**await for 10 seconds and then query the status of the transaction  */
          // let promise = new Promise(function (resolve, reject) {
          //   setTimeout(() => resolve("done!"), 10000);
          // });

          // promise.then((x) => {
          //   req.CheckoutRequestID = response.data.CheckoutRequestID;
          //   next();
          // });
          req.CheckoutRequestID = 1111;
          next();
        },
        (err) => {
          req.CheckoutRequestID = 1111;
          next();
          // res.status(500).json({
          //   message: "Failed",
          //   Error: err,
          // });
        }
      );
  },

  sampleResponse(req, res) {
    res.status(200).json({
      CheckoutRequestID: req.CheckoutRequestID,
    });
  },
};
