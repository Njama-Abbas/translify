const config = require("../config/auth.config");
const twilio = require("twilio");

module.exports = new twilio(
  config.TWILLIO_ACCOUNT_SID,
  config.TWILLIO_AUTH_TOKEN
);
