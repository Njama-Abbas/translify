const config = require("../config/auth.config"),
  db = require("../models"),
  phoneToken = require("generate-sms-verification-code"),
  sms = require("../utils/sms.utils"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

const USER = db.user,
  ROLE = db.role;
const { composeUserResponseObj } = require("../utils/response.utils");
module.exports = {
  signup: async (req, res) => {
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
      res.status(500).json({
        message: `FAILED! 
        Could not create User
        `,
      });
      return;
    }

    const user = await new_user.save();

    //send verification text message
    // let sendText;

    // try {
    //   sendText = await sms.messages.create({
    //     body: `Tans-Code: ${user.verification.code} `,
    //     to: user.phoneno,
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
        message: `FAILED!
        Sorry! We cant seem to find your details
        Please Sign Up
        `,
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
      res.status(401).json({
        message: `FAILED!
        You Entered a Wrong verification code`,
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
        message: `FAILED!
        Sorry! We cant seem to locate you in our system
        Please Sign Up
        `,
      });
      return;
    }

    //decrypt and validate password
    let valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      res.status(403).json({
        accessToken: null,
        message: `FAILED!
        Invalid Login Credentials`,
      });
      return;
    }

    //Take care of a user signing in and is not verified
    if (!user.verification.status) {
      res.status(401).json({
        message: `FAILED!
        You are Not Authaurized`,
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
          status: false,
        },
      });
      await updatedUser.save();
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        An Error Occured Cannot update details`,
        errror,
      });
      return;
    }

    //Send the text
    let sendText;
    try {
      sendText = await sms.messages.create({
        body: `Tans-Code: ${updatedUser.verification.code} `,
        to: "+254" + updatedUser.phoneno.slice(-9),
        from: "+12027598622",
      });
    } catch (e) {
      res.status(500).json({
        message: `FAILED!
        Twillio Send Text Error
        Please Try again Later`,
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
      user = await USER.findByIdAndUpdate(userId, data);
      await user.save();
    } catch (error) {
      res.status(500);
      return;
    }
    const role = await ROLE.findOne({
      _id: user.role,
    });

    res.status(204);
  },

  sendPasswordChangeAuthCode: async (req, res) => {
    const { userId, currentPassword } = req.body;
    const user = await USER.findById(userId);

    if (!user) {
      res.status(404).json({
        message: `FAILED!
        Sorry! We cant seem to locate you in our system
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
          status: true,
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
    // let sendText;
    // try {
    //   sendText = await sms.messages.create({
    //     body: `Tans-Code: ${$user.verification.code} `,
    //     to: "+254" + $user.phoneno.slice(-9),
    //     from: "+12027598622",
    //   });
    // } catch (error) {
    //   res.status(500).json({
    //     message: `FAILED!
    //     Twillio Send Text Error`,
    //     error,
    //   });
    //   return;
    // }

    res.status(201).json({
      v_code: $user.verification.code,
    });
  },

  changePassword: async (req, res) => {
    const { newPassword, userId, v_code } = req.body;

    const user = await USER.findById(userId);

    if (!user) {
      res.status(404).json({
        message: `FAILED!
        Sorry! We cant seem to locate you in our system`,
      });
      return;
    }

    //validate verification code
    if (user.verification.code !== Number(v_code)) {
      res.status(401).json({
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

    res.status(204).json({
      message: `SUCCESSS! 
      Password updated successfully`,
    });
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

    //Send the text
    // let sendText;
    // try {
    //   sendText = await sms.messages.create({
    //     body: `Tans-Code: ${$user.verification.code} `,
    //     to: "+254" + $user.phoneno.slice(-9),
    //     from: "+12027598622",
    //   });
    // } catch (error) {
    //   res.status(500).json({
    //     message: `FAILED!
    //     Twillio Send Text Error`,
    //     error,
    //   });
    //   return;
    // }
    const role = await ROLE.findById($user.role);

    res.status(201).json(composeUserResponseObj($user, role));
  },
  resetPassword: async (req, res) => {
    const { userId, auth_code, newPassword } = req.body;
    const user = await USER.findById(userId);

    if (!user) {
      res.status(404).json({
        message: `Failed 
         Sorry! We cant seem to locate you in our system
        `,
      });
      return;
    }

    if (Number(auth_code) !== user.verification.code) {
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
      res.status(500).json({
        message: `FAILED!
        An Error Occured Cannot update details`,
        error,
      });
      return;
    }

    const role = await ROLE.findById($user.role);

    res.status(201).json(composeUserResponseObj($user, role));
  },
};
