const bcrypt = require("bcrypt"),
  db = require("../models"),
  systemError = require("../utils/error.utils");

const USER = db.user;
const ROLE = db.role;
const { composeUserResponseObj } = require("../utils/response.utils");

module.exports = {
  async create(req, res) {
    const {
      firstname,
      lastname,
      phoneno,
      username,
      password: userPassword,
    } = req.body;

    const $role = await ROLE.findOne({
      name: "client",
    });

    if (!$role) {
      let e = systemError.NOT_FOUND_ERROR("role");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    let user;

    try {
      user = await USER.create({
        firstname,
        lastname,
        phoneno,
        username,
        password: bcrypt.hashSync(userPassword, 10),
        role: $role._id,
      });
      await user.save();
    } catch (error) {
      let e = systemError.CREATION_ERROR("User");
      res.status(500).json({
        message: e.message,
        error,
      });
      return;
    }
    res.status(201).json(composeUserResponseObj(user));
  },

  async fetch(req, res) {
    const $role = await ROLE.findOne({
      name: "client",
    });

    if (!$role) {
      let e = systemError.NOT_FOUND_ERROR("role");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    const users = await USER.find({
      role: $role.id,
    });

    if (!users) {
      let e = systemError.NOT_FOUND_ERROR("Clients");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }
    const clients = users.map((client) =>
      composeUserResponseObj(client, $role)
    );
    res.set("content-range", clients.length);
    res.status(200).json(clients);
  },

  async get(req, res) {
    const id = req.params.id;
    const user = await USER.findById(id);

    if (!user) {
      let e = systemError.NOT_FOUND_ERROR("Client");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    let $role = await ROLE.findById(user.role);

    res.status(200).json(composeUserResponseObj(user, $role));
  },

  delete: async (req, res) => {
    const clientId = req.params.id;
    const user = await USER.findById(clientId);

    if (!user) {
      let e = systemError.NOT_FOUND_ERROR("Client");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }
    let deletedUser;
    try {
      deletedUser = await USER.findByIdAndDelete(clientId);
    } catch (error) {
      let e = systemError.DELETE_ERROR("Client");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    res.status(204).json({});
  },

  async update(req, res) {
    const { userId, status } = req.body;
    let updatedUser;
    try {
      updatedUser = await USER.findByIdAndUpdate(
        userId,
        {
          account_status: status,
        },
        { new: true }
      );
    } catch (error) {
      let e = systemError.UPDATE_ERROR("User Status");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }
    if (!updatedUser) {
      let e = systemError.NOT_FOUND_ERROR("User");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    let role = await ROLE.findById(updatedUser.role);
    res.status(200).json(composeUserResponseObj(updatedUser, role));
  },
};
