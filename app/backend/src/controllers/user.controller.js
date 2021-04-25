const db = require("../models");
const config = require("../config/auth.config");
const USER = db.user;
const ROLE = db.role;
const phoneToken = require("generate-sms-verification-code"),
  twilio = require("twilio"),
  bcrypt = require("bcrypt");

const SMS = new twilio(config.TWILLIO_ACCOUNT_SID, config.TWILLIO_AUTH_TOKEN);

module.exports = {
  allAccess: async (_req, res) => {
    res.status(200).json({
      content: "Public content",
    });
  },

  userDashBoard: async (req, res) => {
    const user = await USER.findOne({
      _id: req.userId,
    });

    const role = await ROLE.findOne({
      _id: user.role,
    });

    res.status(200).json(userResponseObject(user, role));
  },

  update: async (req, res) => {
    const { data, userId } = request.body;
    let user;
    try {
      user = await USER.findByIdAndUpdate(userId, data);
      await user.save();
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        An error occured while updating details
        `,
        error,
      });
      return;
    }
    const role = await ROLE.findOne({
      _id: user.role,
    });

    res.status(204).json(userResponseObject(user, role));
  },

  sendPasswordResetCode: async (req, res) => {
    const { userId, currentPassword } = req.body;

    const user = await USER.findById(userId);

    if (!user) {
      res.status(404).json({
        message: `FAILED!
        User not found
        `,
      });
      return;
    }

    //validate current password
    const valid = bcrypt.compareSync(currentPassword, user.password);

    if (!valid) {
      res.status(403).json({
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
      $user = await USER.findByIdAndUpdate(user._id, {
        verification: {
          code: generated_code,
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

    //Send the text
    let sendText;
    try {
      sendText = await SMS.messages.create({
        body: `Tans-Code: ${$user.verification.code} `,
        to: "+254" + $user.phoneno.slice(-9),
        from: "+12027598622",
      });
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        Twillio Send Text Error`,
        error,
      });
      return;
    }
    res.status(201).json({
      v_code: $user.verification.code,
    });
  },

  resetPassword: async (req, res) => {
    const { newPassword, userId, v_code } = req.body;

    const user = await USER.findById(userId);

    if (!user) {
      res.status(404).json({
        message: `FAILED!
        User not found`,
      });
      return;
    }

    //validate verification code
    if (user.verification.code !== Number(v_code)) {
      res.status(401).json({
        message: "Wrong verification code",
      });
      return;
    }

    //valid change password
    let updatedUser;
    try {
      updatedUser = await USER.findByIdAndUpdate(user._id, {
        password: bcrypt.hashSync(newPassword, 10),
      });
      await updatedUser.save();
    } catch (error) {}

    if (!updatedUser) {
      res.status(500).json({
        message: `FAILED!
        An Error Occured Cannot update password`,
      });
      return;
    }

    res.status(204).json({
      message: `SUCCESSS! 
      Password updated successfully`,
    });
  },
};

const userResponseObject = (user, role) => ({
  email: user.email,
  firstname: user.firstname,
  lastname: user.lastname,
  phoneno: user.phoneno,
  rating: user.rating,
  role: role.name,
  verification: user.verification,
  id: user.id,
});
