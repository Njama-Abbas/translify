const Router = require("express").Router();

const mpesaController = require("../controllers/mpesa.controller");
const { reqMpesaToken } = require("../middlewares/mpesa_token");

Router.post("/stk-push", reqMpesaToken, mpesaController.stkPush);

module.exports = Router;
