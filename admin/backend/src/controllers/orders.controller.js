const db = require("../models");

const USER = db.user;
const ROLE = db.role;
const DRIVER = db.driver;
const ORDER = db.order;

module.exports = {
  fetch: async (req, res) => {
    const orders = await ORDER.find({});
    if (!orders) {
      res.status(500).json({
        message: `FAILED!
        Orders not found`,
      });
      return;
    }

    const mappedOrders = await MapOrders(orders);

    res.status(200).json(mappedOrders);
  },
  get: async (req, res) => {
    const id = req.params.id;
    const order = await ORDER.findById(id);

    if (!order) {
      res.status(404).json({
        message: `FAILED!
         ORDER Not Found`,
      });
      return;
    }

    const mappedOrders = await MapOrders([order]);
    res.status(200).json(mappedOrders[0]);
  },

  fetchById: async (req, res) => {
    const { userid } = req.headers;

    const user = await USER.findById(userid);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    const role = await ROLE.findById(user.role);

    if (!role) {
      res.status(404).json({
        message: "We could not locate the supplied role",
      });
    }

    let orders = [];

    if (role.name === "client") {
      orders = await ORDER.find({
        clientId: userid,
      });
    } else if (role.name === "driver") {
      const driver = await DRIVER.findOne({
        userId: userid,
      });
      if (!driver) {
        res.status(404).json({
          message: "Driver not found",
        });
        return;
      }
      orders = await ORDER.find({
        driverId: driver._id,
      });
    }
    if (!orders) {
      res.status(404).json({
        message: "orders not found",
      });
      return;
    }
    if (orders.length === 0) {
      res.status(200).json(orders);
      return;
    }
    const mappedOrders = await MapOrders(orders);
    res.status(200).json(mappedOrders);
  },
};

async function MapOrders(orders) {
  const mappedOrders = await Promise.all(
    orders.map(async (order) => {
      const {
        pickup,
        destination,
        charges,
        load,
        status,
        orderDate,
        clientId,
        driverId,
        _id: id,
      } = order;

      const designatedDriver = await DRIVER.findById(driverId);

      const driver = await USER.findById(designatedDriver.userId);

      const client = await USER.findById(clientId);

      return {
        id,
        driver: {
          firstname: driver.firstname,
          lastname: driver.lastname,
          truckno: designatedDriver.truckno,
        },
        client: {
          firstname: client.firstname,
          lastname: client.lastname,
        },
        pickup,
        destination,
        charges,
        load,
        status,
        orderDate,
      };
    })
  );
  return mappedOrders;
}
