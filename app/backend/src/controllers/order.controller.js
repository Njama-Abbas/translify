const db = require("../models");
const ORDER = db.order;
const DRIVER = db.driver;
const ROLE = db.role;
const USER = db.user;

module.exports = {
  creteOrder: async (req, res) => {
    const {
      moveType,
      clientId,
      driverId,
      pickup,
      destination,
      load,
      charges,
    } = req.body;

    const CheckoutRequestID = req.CheckoutRequestID;
    //add order to database

    if (!CheckoutRequestID) {
      res.status(500).json({
        message: "FAILED! Payment process failed please try again",
      });
      return;
    }

    let new_order;
    try {
      new_order = await ORDER.create({
        moveType,
        clientId,
        driverId,
        pickup,
        destination,
        load,
        charges,
        date: new Date(),
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
      return;
    }

    const order = await new_order.save();

    /**
     * @todo
     * deposit money into admins account
     */

    //Reserve driver until the order is completed
    let designatedDriver;
    try {
      designatedDriver = await DRIVER.findByIdAndUpdate(driverId, {
        reserved: true,
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
      return;
    }

    await designatedDriver.save();

    const orders = [order];
    const mappedOrders = await MapOrders(orders);
    res.status(200).json(mappedOrders[0]);
  },

  getAllOrdersByUserId: async (req, res) => {
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

  updateOrder: async (req, res) => {
    const { OID, status, UID } = req.body;

    // updating the order
    let order;
    try {
      order = await ORDER.findByIdAndUpdate(OID, {
        status,
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
      return;
    }

    //if null result
    if (!order) {
      res.status(404).json({
        message: "order not found",
      });
      return;
    }

    //successfull >
    //1. successfull
    const user = await USER.findById(UID);

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

    const driver = await DRIVER.findOne({
      _id: order.driverId,
    });

    if (!driver) {
      res.status(404).json({
        message: "Driver not found",
      });
      return;
    }

    //unreserve driver
    if (status == "cancelled" || status == "successfull") {
      let designatedDriver;
      try {
        designatedDriver = await DRIVER.findByIdAndUpdate(driver._id, {
          reserved: false,
        });
      } catch (err) {
        res.status(500).json({
          message: err,
        });
        return;
      }
      await designatedDriver.save();
    }

    let orders = [];

    if (role.name === "client") {
      orders = await ORDER.find({
        clientId: UID,
      });
    } else if (role.name === "driver") {
      orders = await ORDER.find({
        driverId: driver._id,
      });
    }

    //no orders available for user ids
    if (!orders) {
      res.status(404).json({
        message: "orders not found",
      });
      return;
    }

    //order collection is empty
    if (orders.length === 0) {
      res.status(204).json(orders);
      return;
    }

    const mappedOrders = await MapOrders(orders);

    res.status(200).json(mappedOrders);
  },
};
/**
 *
 * @param {[]} orders
 * @returns {[]} an array of orders mapped eith driver and client names
 */
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

      const designatedDriver = await DRIVER.findOne({
        _id: driverId,
      });
      const driver = await USER.findOne({
        _id: designatedDriver.userId,
      });

      const client = await USER.findOne({
        _id: clientId,
      });

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
