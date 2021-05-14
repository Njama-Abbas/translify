const config = require("../config/auth.config"),
  db = require("../models"),
  systemError = require("../utils/error.utils");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  async signin(req, res) {
    const { username, password } = req.body;
    const admin_role = await Role.findOne({
      name: "admin",
    });

    const admin = await User.findOne({
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

    let token = jwt.sign({ id: admin.id }, config.secret, {
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
  sendPasswordChangeAuthCode: async (req, res) => {
    const { userId, currentPassword } = req.body;
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
      let e = systemError.UPDATE_ERROR("user");
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
      let e = systemError.TWILIO_ERROR(sms.error.status || 401);
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
      let e = systemError.NOT_FOUND_ERROR("user");
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
          status: true,
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
    res.status(204);
  },
};
