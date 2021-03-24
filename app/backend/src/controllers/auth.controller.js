const config = require("../config/auth.config"),
  db = require("../models"),
  phoneToken = require("generate-sms-verification-code"),
  twilio = require("twilio"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

const User = db.user,
  Role = db.role;

module.exports = {
  signup: async (req, res) => {
    const {
      firstname,
      lastname,
      phoneno,
      email,
      password: userPassword,
      role,
    } = req.body;

    const $role = await Role.findOne({
      name: role,
    });

    //generate sms verification code
    const generated_code = phoneToken(8, {
      type: "number",
    });

    //create a new user
    let new_user;
    try {
      new_user = await User.create({
        firstname,
        lastname,
        phoneno,
        email,
        password: bcrypt.hashSync(userPassword, 10),
        role: $role._id,
        verification: {
          code: generated_code,
        },
      });
    } catch (e) {
      res.status(500).json({
        message: `Create User Error: ${e}`,
      });
      return;
    }

    const user = await new_user.save();

    let sms;
    try {
      sms = new twilio(config.TWILLIO_ACCOUNT_SID, config.TWILLIO_AUTH_TOKEN);
    } catch (e) {
      res.status(500).json({
        message: `Twillio Authentication Error ${e}`,
      });
      return;
    }

    //send verification text message
    let sendText;

    try {
      sendText = await sms.messages.create({
        body: `Tans-Code: ${user.verification.code} `,
        to: "+254" + user.phoneno.slice(-9),
        from: "+12027598622",
      });
    } catch (e) {
      res.status(500).json({
        message: `Twillio Send Text Error ${e}`,
      });
      return;
    }

    res.status(201).json({
      UID: user._id,
      phoneno: user.phoneno,
      sid: sendText.sid,
    });
  },

  verify: async (req, res) => {
    const { UID, v_code } = req.body;

    const user = await User.findOne({
      _id: UID,
    });

    if (!user) {
      res.status(404).json({
        message: "User nor found",
      });
      return;
    }

    if (user.verification.status) {
      res.status(200).json({
        message: "User Already verified",
      });
      return;
    }

    if (user.verification.code !== v_code) {
      res.status(401).json({
        message: "Wrong verification code",
      });
      return;
    }

    /**
     * if code entered by user
     * is equal to code in the database
     * generate a json-web-token
     * to sign in the user;
     */

    const $role = await Role.findOne({
      _id: user.role,
    });

    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phoneno: user.phoneno,
      role: $role.name,
      accessToken: token,
    });
  },

  signin: async (req, res) => {
    const { email, password, role } = req.body;

    const $role = await Role.findOne({
      name: role,
    });

    const user = await User.findOne({
      email,
      role: $role._id,
    });

    //user is not in the database
    if (!user) {
      res.status(404).json({
        message: "User Not Found",
      });
      return;
    }

    //decrypt and validate password
    let valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      res.status(403).json({
        accessToken: null,
        message: "Invalid Password",
      });
      return;
    }

    //Take care of a user signing in and is not verified
    if (!user.verification.status) {
      res.status(401).json({
        message: "Not Authaurized",
        UID: user._id,
        phoneno: user.phoneno,
      });
      return;
    }

    // if verified give the access token
    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phoneno: user.phoneno,
      role: $role.name,
      accessToken: token,
    });
  },
};
