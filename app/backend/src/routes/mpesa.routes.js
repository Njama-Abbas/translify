const Router = require("express").Router();

const { Mpesa } = require("../middlewares");

Router.post(
  "/stk-push",
  [Mpesa.reqMpesaToken, Mpesa.stkPush],
  Mpesa.sampleResponse
);

Router.post("/", (req, res) => {
  console.log("--------------STK-------------");
  console.log(req.body);
  /**save transaction to db */
});

Router.get("/", Mpesa.mpesaPassword);

module.exports = Router;
