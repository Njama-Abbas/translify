const config = require("../config/auth.config"),
  db = require("../models"),
  systemError = require("../utils/error.utils"),
  phoneToken = require("generate-sms-verification-code");
const { sendText } = require("../utils/sms.utils");
const { composeAdminResponseObj } = require("../utils/response.utils");

const USER = db.user;
const ROLE = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  async signin(req, res) {
    const { username, password } = req.body;
    const admin_role = await ROLE.findOne({
      name: "admin",
    });

    const admin = await USER.findOne({
      username,
      role: admin_role._id,
    });

    if (!admin) {
      res.status(404).json({
        message: "User Not Found",
      });
      return;
    }

    const valid = bcrypt.compareSync(password, admin.password);
    if (!valid) {
      let e = systemError.UNAUTHORIZED_ERROR();
      res.status(e.status).json({
        accesstoken: null,
        message: e.message,
      });
      return;
    }

    let token = jwt.sign({ id: admin.id }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: 86400,
    });

    const { _id: id, firstname, lastname, phoneno } = admin;

    res.status(200).json({
      id,
      firstname,
      lastname,
      username: admin.username,
      phoneno,
      role: admin_role.name,
      accessToken: token,
    });
  },

  changePassword: async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    console.log({ userId, currentPassword, newPassword });

    const user = await USER.findById(userId);

    if (!user) {
      let e = systemError.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    //validate current password
    const valid = bcrypt.compareSync(currentPassword, user.password);

    if (!valid) {
      let e = systemError.UNAUTHORIZED_ERROR();
      res.status(e.status).json({
        message: `FAILED! 
        Your current password is Incorrect
        `,
      });
      return;
    }

    //valid change password
    let updatedUser;
    try {
      updatedUser = await USER.findByIdAndUpdate(
        user._id,
        {
          password: bcrypt.hashSync(newPassword, 10),
        },
        { new: true }
      );
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        An Error Occured Cannot update password`,
        error,
      });
      return;
    }

    res.status(204).json({});
  },
  sendPasswordResetAuthCode: async (req, res) => {
    const { phoneno } = req.body;
    const admin_role = await ROLE.findOne({
      name: "admin",
    });

    const user = await USER.findOne({
      phoneno,
      role: admin_role._id,
    });

    if (!user) {
      res.status(404).json({
        message: `Failed 
         You are not Admin
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
      $user = await USER.findByIdAndUpdate(
        user._id,
        {
          verification: {
            code: generated_code,
          },
        },
        { new: true }
      );
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        An Error Occured Cannot update details`,
        error,
      });
      return;
    }

    //send verification text message
    let sms = await sendText(
      $user.phoneno,
      ` Auth-Code: ${$user.verification.code}`
    );

    if (!sms.message || sms.error) {
      let e = systemError.TWILIO_ERROR(sms.error.status || 401);
      res.status(e.status).json({
        message: e.message,
        error: sms.error,
      });
      return;
    }

    const role = await ROLE.findById($user.role);
    res.status(200).json(composeAdminResponseObj($user, role));
  },

  resetPassword: async (req, res) => {
    const { userId, auth_code, newPassword } = req.body;
    const user = await USER.findById(userId);

    if (!user) {
      let e = systemError.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    if (Number(auth_code) !== user.verification.code) {
      let e = systemError.CONFLICT_ERROR("verifcation code");
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
        },
      });
      await $user.save();
    } catch (error) {
      let e = systemError.UPDATE_ERROR("user");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }
    const role = await ROLE.findById($user.role);
    res.status(200).json(composeAdminResponseObj($user, role));
  },
  async accountBalance(req, res) {
    const id = req.headers.userid;
    const user = await USER.findById(id);
    if (!user) {
      let e = systemError.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    res.status(200).json({
      account_balance: user.account_balance,
    });
  },
  updateInfo: async (req, res) => {
    const { data, userId } = req.body;
    let user;
    try {
      user = await USER.findByIdAndUpdate(userId, data, { new: true });
    } catch (error) {
      let e = systemError.UPDATE_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    if (!user) {
      let e = systemError.NOT_FOUND_ERROR("user");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    res.status(200).json({});
  },
};
