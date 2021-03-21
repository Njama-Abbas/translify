const config = require("../config/auth.config"),
  db = require("../models"),
  phoneToken = require("generate-sms-verification-code"),
  twilio = require("twilio"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

const User = db.user,
  Role = db.role,
  sms = new twilio(config.T_SID, config.T_AUTH);

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

    const $role = Role.findOne({
      name: role,
    });

    //generate sms verification code
    const generated_code = phoneToken(8, {
      type: "number",
    });

    //create a new user
    const new_user = await User.create({
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

    const user = await new_user.save();

    //send verification text message
    sms.messages
      .create({
        body: `Tans-Code: ${user.verification.code} `,
        to: "+254" + user.phoneno,
        from: "+12027598622",
      })
      .then((message) => {
        res.status(201).json({
          userID: user._id,
        });
      });
  },

  signin: async (req, res) => {
    const { email, password, role } = req.body;

    const $role = Role.findOne({
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
      res.status(401).json({
        accessToken: null,
        message: "Invalid Password",
      });
      return;
    }

    //Take care of a user signing in and is not verified
    if (!user.verification.status) {
      res.status(401).json({
        message: "Not Authaurized",
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
