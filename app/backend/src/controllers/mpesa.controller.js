const axios = require("axios").default;
const datetime = require("node-datetime");
const LIPANAMPESAPASSKEY = "YOUR LIPA NA MPESA ONLINE PASS KEY";
const LIPANAMPESASHORTCODE = "YOUR LIPA NA MPESA SHORT CODE";

const timeStamp = () => {
  const date = datetime.create();
  const timestamp = date.format("YmdHMS");
  return timestamp;
};

const generatePassword = () => {
  const passString = LIPANAMPESASHORTCODE + LIPANAMPESAPASSKEY + timeStamp();
  const pwd = Buffer.from(passString).toString("base64");
  return pwd;
};

module.exports = {
  mpesaPassword: (req, res) => {
    res.status(200).json({
      PWD: generatePassword(),
    });
  },

  stkPush: (req, res) => {
    const mpesa_token = req.mpesa_token;
    const endpoint =
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const auth = "Bearer " + mpesa_token;

    const headers = {
      Authorization: auth,
    };

    let Password = generatePassword(),
      Timestamp = timeStamp();

    let data = {
      BusinessShortCode: "174379",
      Password,
      Timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: "1",
      PartyA: "254748717044" /**phone no to push stk to */,
      PartyB: "174379",
      PhoneNumber: "254748717044" /**phone no to push stk to */,
      CallBackURL: "http://192.168.1.117/callback",
      AccountReference: "TRANSLIFY",
      TransactionDesc: "Lipa na mpesa",
    };

    axios
      .post(endpoint, data, {
        headers,
      })
      .then((response) => {
        /**await for 10 seconds and then query the status of the transaction  */
        const endpoint =
          "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";

        const data = {
          BusinessShortCode: "174379",
          Password,
          Timestamp,
          CheckoutRequestID: response.data.CheckoutRequestID,
        };

        axios
          .post(endpoint, data, {
            headers,
          })
          .then(
            (response) => {
              res.status(200).json(response.data);
              /**save data to the DB */
            },
            (err) => {
              res.status(500).json(err);
            }
          );
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};
