const { role } = require("../models");
const db = require("../models");
const ORDER = db.order;
const DRIVER = db.driver;
const ROLE = db.role;
const USER = db.user;

exports.creteOrder = (req, res) => {
  const {
    moveType,
    clientId,
    driverId,
    pickup,
    destination,
    load,
    charges,
  } = req.body;

  const newOrder = new ORDER({
    moveType,
    clientId,
    driverId,
    pickup,
    destination,
    load,
    charges,
    date: new Date(),
  });

  newOrder.save((err, order) => {
    if (err) {
      res.status(500).json({
        message: err,
      });
      return;
    }

    res.status(200).json({
      order,
    });
  });
};

exports.getAllOrdersByUserId = async (req, res) => {
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
    res.status(204).json(orders);
    return;
  }

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
  res.status(200).json(mappedOrders);
};

exports.updateOrder = (req, res) => {
  const { orderId: _id, status } = req.body;

  ORDER.findOne(
    {
      _id,
    },
    (err, order) => {
      if (err) {
        res.status(500).json({
          message: err,
        });
        return;
      }

      if (!order) {
        res.status(404).json({
          message: "order not found",
        });
        return;
      }

      order.status = status;

      order.save((err, order) => {
        if (err) {
          res.status(500).json({
            message: err,
          });
          return;
        }
        res.status(200).json({
          message: "Order Updated Successfully",
        });
      });
    }
  );
};
