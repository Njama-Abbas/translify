const config = require("../config/auth.config");
const twilio = require("twilio");

const client = new twilio(
  config.TWILLIO_ACCOUNT_SID,
  config.TWILLIO_AUTH_TOKEN
);

module.exports = {
  async sendText(phoneno, text) {
    let message = null,
      error = null;
    try {
      let sms = await client.messages.create({
        body: `Translify Move With Pride:\n${text}
      `,
        to: `+254${phoneno.slice(-9)}`,
        from: "+12027598622",
      });
      message = sms;
    } catch (e) {
      error = e;
      message = null;
    }
    return {
      message,
      error,
    };
  },
};

async function tryme(req, res) {
  let sms = await sendText("0748717044", "Testing 123");

  if (!sms.message || sms.error) {
    res.status(sms.error.status).json({
      message: "Failed To Send Text",
      error: sms.error,
    });
    return;
  }
  res.status(200).json({
    message: sms.message.sid,
  });
}
