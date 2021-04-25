const config = require("../config/auth.config"),
  db = require("../models"),
  phoneToken = require("generate-sms-verification-code"),
  twilio = require("twilio"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

const USER = db.user,
  ROLE = db.role,
  PHOTO = db.photo,
  SMS = new twilio(config.TWILLIO_ACCOUNT_SID, config.TWILLIO_AUTH_TOKEN);

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

    const $role = await ROLE.findOne({
      name: role,
    });

    //generate sms verification code
    const generated_code = phoneToken(8, {
      type: "number",
    });

    //create a new user
    let new_user;
    try {
      new_user = await USER.create({
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

    //send verification text message
    // let sendText;

    // try {
    //   sendText = await sms.messages.create({
    //     body: `Tans-Code: ${user.verification.code} `,
    //     to: "+254" + user.phoneno.slice(-9),
    //     from: "+12027598622",
    //   });
    // } catch (e) {
    //   res.status(500).json({
    //     message: `Twillio Send Text Error ${e}`,
    //   });
    //   return;
    // }

    res.status(201).json({
      UID: user._id,
      phoneno: user.phoneno,
    });
  },

  verify: async (req, res) => {
    const { ID, v_code } = req.body;

    const user = await USER.findOne({
      _id: ID,
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

    if (user.verification.code !== Number(v_code)) {
      res.status(401).json({
        message: "Wrong verification code",
      });
      return;
    }

    /**
     *  if code entered by user
     * is equal to code in the database
     * change verification status to true
     * generate a new verifictaion code
     */

    const new_generated_code = phoneToken(8, {
      type: "number",
    });

    const updatedUser = await USER.findByIdAndUpdate(user._id, {
      verification: {
        status: true,
        code: new_generated_code,
      },
    });

    await updatedUser.save();

    /**
     * get the users role
     */

    const $role = await ROLE.findOne({
      _id: updatedUser.role,
    });

    /**
     * generate a json-web-token
     * to sign in the user;
     */

    let token = jwt.sign({ id: updatedUser.id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).json({
      id: updatedUser._id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      phoneno: updatedUser.phoneno,
      role: $role.name,
      accessToken: token,
    });
  },

  signin: async (req, res) => {
    const { email, password, role } = req.body;

    const $role = await ROLE.findOne({
      name: role,
    });

    const user = await USER.findOne({
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

  resendVerificationCode: async (req, res) => {
    //generate sms verification code
    const generated_code = phoneToken(8, {
      type: "number",
    });

    //change the existing token in the database;
    let updatedUser;
    try {
      updatedUser = await USER.findByIdAndUpdate(req.body.userID, {
        verification: {
          code: generated_code,
        },
      });
      await updatedUser.save();
    } catch (error) {
      res.status(500).json({
        message: `An Error Occured Cannot update details ${e}`,
      });
      return;
    }

    //Send the text
    let sendText;
    try {
      sendText = await SMS.messages.create({
        body: `Tans-Code: ${updatedUser.verification.code} `,
        to: "+254" + updatedUser.phoneno.slice(-9),
        from: "+12027598622",
      });
    } catch (e) {
      res.status(500).json({
        message: `Twillio Send Text Error ${e}`,
      });
      return;
    }

    res.status(201).json({
      UID: updatedUser._id,
      phoneno: updatedUser.phoneno,
    });
  },
};
