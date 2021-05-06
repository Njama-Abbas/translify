const config = require("../config/auth.config"),
  db = require("../models"),
  phoneToken = require("generate-sms-verification-code"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

const USER = db.user,
  ROLE = db.role;

const { sendText } = require("../utils/sms.utils");
const { composeUserResponseObj } = require("../utils/response.utils");
const IN_ERR = require("../utils/error.utils");

module.exports = {
  /**
   *
   * @returns {{}} creation response
   */
  async signup(req, res) {
    const {
      firstname,
      lastname,
      phoneno: user_phoneno,
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
        phoneno: "254" + user_phoneno.slice(-9),
        email,
        password: bcrypt.hashSync(userPassword, 10),
        role: $role._id,
        verification: {
          code: generated_code,
        },
      });
    } catch (error) {
      let e = IN_ERR.CREATION_ERROR("user");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }

    const user = await new_user.save();

    //send verification text message
    let sms = await sendText(
      user.phoneno,
      `Auth-Code: ${user.verification.code}`
    );

    if (!sms.message || sms.error) {
      let e = IN_ERR.TWILIO_ERROR(sms.error.status || 401);
      res.status(e.status).json({
        message: e.message,
        error: sms.error,
      });
      return;
    }

    res.status(201).json({
      UID: user._id,
      phoneno: user.phoneno,
    });
  },

  /**
   *
   * Verify a user by comparing the code in the database and the code input by te user captured in the request object
   * @returns {{}} verifys and signs in a user
   */

  verify: async (req, res) => {
    const { ID, v_code } = req.body;
    const user = await USER.findById(ID);

    if (!user) {
      let e = IN_ERR.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    if (user.verification.status) {
      res.status(200).json({
        message: `AHEM!
        You are Already verified
        `,
      });
      return;
    }

    if (user.verification.code !== Number(v_code)) {
      let e = IN_ERR.CONFLICT_ERROR("verifcation code");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    /**
     * if code entered by user
     * is equal to code in the database
     * change verification status to true
     * generate a new verifictaion code
     */

    const new_generated_code = phoneToken(8, {
      type: "number",
    });

    const updatedUser = await USER.findByIdAndUpdate(
      user._id,
      {
        verification: {
          status: true,
          code: new_generated_code,
        },
      },
      { new: true }
    );

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

    res.status(201).json(composeUserResponseObj(updatedUser, $role, token));
  },

  signin: async (req, res) => {
    const { email, password, role } = req.body;

    const $role = await ROLE.findOne({
      name: role,
    });

    const user = await USER.findOne({
      email,
    });

    //user is not in the database
    if (!user) {
      let e = IN_ERR.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    const isCorrectRole = String(user.role) === String($role._id);
    if (!isCorrectRole) {
      let e = IN_ERR.FORBIDDEN_ERROR($role.name);
      res.status(e.status).json({
        message: e.message,
      });
    }

    //decrypt and validate password
    let valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      let e = IN_ERR.UNAUTHORIZED_ERROR();
      res.status(e.status).json({
        accessToken: null,
        message: e.message,
      });
      return;
    }

    //Take care of a user signing in and is not verified
    if (!user.verification.status) {
      let e = IN_ERR.UNAUTHORIZED_ERROR();
      res.status(e.status).json({
        message: `FAILED!\n You are not Verified`,
        UID: user._id,
        phoneno: user.phoneno,
      });
      return;
    }

    // if verified give the access token
    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).json(composeUserResponseObj(user, $role, token));
  },

  resendVerificationCode: async (req, res) => {
    //generate sms verification code
    const generated_code = phoneToken(8, {
      type: "number",
    });

    //change the existing token in the database;
    let updatedUser;
    try {
      updatedUser = await USER.findByIdAndUpdate(
        req.body.userID,
        {
          verification: {
            code: generated_code,
            status: false,
          },
        },
        { new: true }
      );
    } catch (error) {
      let e = IN_ERR.UPDATE_ERROR("user");
      res.status(e.status).json({
        message: e.message,
        errror,
      });
      return;
    }
    //send verification text message
    let sms = await sendText(
      updatedUser.phoneno,
      `Auth-Code: ${updatedUser.verification.code}`
    );

    if (!sms.message || sms.error) {
      let e = IN_ERR.TWILIO_ERROR(sms.error.status || 401);
      res.status(e.status).json({
        message: e.message,
        error: sms.error,
      });
      return;
    }

    res.status(201).json({
      UID: updatedUser._id,
      phoneno: updatedUser.phoneno,
    });
  },

  updateInfo: async (req, res) => {
    const { data, userId } = req.body;
    let user;
    try {
      user = await USER.findByIdAndUpdate(userId, data, { new: true });
    } catch (error) {
      let e = IN_ERR.UPDATE_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    if (!user) {
      let e = IN_ERR.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    res.status(204);
  },

  sendPasswordChangeAuthCode: async (req, res) => {
    const { userId, currentPassword } = req.body;
    const user = await USER.findById(userId);

    if (!user) {
      let e = IN_ERR.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    //validate current password
    const valid = bcrypt.compareSync(currentPassword, user.password);

    if (!valid) {
      let e = IN_ERR.UNAUTHORIZED_ERROR();
      res.status(e.status).json({
        message: `FAILED! 
        Your current password is Incorrect
        `,
      });
      return;
    }

    //valid generate sms verification code
    const generated_code = phoneToken(8, {
      type: "number",
    });

    //change the existing verification code in the database;
    let $user;
    try {
      $user = await USER.findByIdAndUpdate(
        user._id,
        {
          verification: {
            code: generated_code,
            status: true,
          },
        },
        { new: true }
      );
    } catch (error) {
      let e = IN_ERR.UPDATE_ERROR("user");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }

    //send verification text message
    let sms = await sendText(
      $user.phoneno,
      `Auth-Code: ${$user.verification.code}`
    );

    if (!sms.message || sms.error) {
      let e = IN_ERR.TWILIO_ERROR(sms.error.status || 401);
      res.status(e.status).json({
        message: e.message,
        error: sms.error,
      });
      return;
    }
    res.status(204);
  },

  changePassword: async (req, res) => {
    const { newPassword, userId, v_code } = req.body;

    const user = await USER.findById(userId);

    if (!user) {
      let e = IN_ERR.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    //validate verification code
    if (user.verification.code !== Number(v_code)) {
      let e = res.status(401).json({
        message: `FAILED!
        You entered the Wrong verification code`,
      });
      return;
    }

    const generated_code = phoneToken(8, {
      type: "number",
    });

    //valid change password
    let updatedUser;
    try {
      updatedUser = await USER.findByIdAndUpdate(user._id, {
        password: bcrypt.hashSync(newPassword, 10),
        verification: {
          code: generated_code,
          status: true,
        },
      });
      await updatedUser.save();
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        An Error Occured Cannot update password`,
        error,
      });
      return;
    }

    res.status(204);
  },
  sendPasswordResetAuthCode: async (req, res) => {
    const { phoneno } = req.body;
    const user = await USER.findOne({
      phoneno,
    });

    if (!user) {
      res.status(404).json({
        message: `Failed 
         Sorry! We cant seem to locate you in our system
        `,
      });
      return;
    }

    //genereate auth_code
    const generated_code = phoneToken(8, {
      type: "number",
    });

    //change the existing verification code in the database;
    let $user;
    try {
      $user = await USER.findByIdAndUpdate(user._id, {
        verification: {
          code: generated_code,
          status: false,
        },
      });
      await $user.save();
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        An Error Occured Cannot update details`,
        error,
      });
      return;
    }
    res.status(204);
  },
  resetPassword: async (req, res) => {
    const { userId, auth_code, newPassword } = req.body;
    const user = await USER.findById(userId);

    if (!user) {
      let e = IN_ERR.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    if (Number(auth_code) !== user.verification.code) {
      let e = IN_ERR.CONFLICT_ERROR("verifcation code");
      res.status(403).json({
        message: `Failed 
         Invalid Authentication Code
        `,
      });
      return;
    }
    const generated_code = phoneToken(8, {
      type: "number",
    });

    let $user;
    //change the existing verification code in the database;
    try {
      $user = await USER.findByIdAndUpdate(user._id, {
        password: bcrypt.hashSync(newPassword, 10),
        verification: {
          code: generated_code,
          status: true,
        },
      });
      await $user.save();
    } catch (error) {
      let e = IN_ERR.UPDATE_ERROR("user");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }
    res.status(204);
  },
};
