const bcrypt = require("bcrypt");
const db = require("../models");
const USER = db.user;
const ROLE = db.role;

module.exports = {
  create: async (req, res) => {
    const {
      firstname,
      lastname,
      phoneno,
      email,
      password: userPassword,
    } = req.body;

    const $role = await ROLE.findOne({
      name: "client",
    });

    if (!$role) {
      res.status(404).json({
        message: "Role not found",
      });
      return;
    }

    let user;

    try {
      user = await USER.create({
        firstname,
        lastname,
        phoneno,
        email,
        password: bcrypt.hashSync(userPassword, 10),
        role: $role._id,
      });
      await user.save();
    } catch (error) {
      res.status(500).json({
        message: "Process to create 'USER' for role 'CLIENT' failed",
        error,
      });
      return;
    }

    res.status(201).json(clientResponseObject(user));
  },

  fetch: async (req, res) => {
    const $role = await ROLE.findOne({
      name: "client",
    });

    if (!$role) {
      res.status(404).json({
        message: "Role Not Found",
      });
      return;
    }

    const users = await USER.find({
      role: $role.id,
    });

    if (!users) {
      res.status(404).json({
        message: "Drivers Not Found",
      });
      return;
    }
    const clients = users.map((client) => clientResponseObject(client));
    res.set("content-range", clients.length);
    res.status(200).json(clients);
  },

  get: async (req, res) => {
    const id = req.params.id;
    const user = await USER.findOne({
      _id: id,
    });

    if (!user) {
      res.status(404).json({
        message: "Client Not Found",
      });
      return;
    }

    const {
      rating,
      _id,
      firstname,
      lastname,
      phoneno,
      email,
      verification,
    } = user;

    const client = {
      id: _id,
      firstname,
      lastname,
      phoneno,
      email,
      rating,
      v_status: verification.status,
    };

    res.status(200).json(client);
  },

  delete: async (req, res) => {
    const clientId = req.params.id;
    const user = await USER.findById(clientId);
    if (!user) {
      res.status(404).json({
        message: "Client Not Found",
      });
      return;
    }
    await USER.findByIdAndDelete(clientId);

    res.status(204).json({
      message: "DELETE == SUCCESS",
    });
  },
};

const clientResponseObject = (user) => ({
  rating: user.rating,
  id: user._id,
  firstname: user.firstname,
  lastname: user.lastname,
  phoneno: user.phoneno,
  email: user.email,
  v_status: user.verification.status,
});
