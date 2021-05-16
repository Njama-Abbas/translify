const db = require("../models"),
  sms = require("../utils/sms.utils");
const { sendText } = require("../utils/sms.utils");
const systemError = require("../utils/error.utils");
const {
  composeOrderResponseObj,
  averageRating,
} = require("../utils/response.utils");

const ORDER = db.order,
  DRIVER = db.driver,
  ROLE = db.role,
  USER = db.user;

module.exports = {
  creteOrder: async (req, res) => {
    const { moveType, clientId, driverId, pickup, destination, load, charges } =
      req.body;

    const CheckoutRequestID = req.CheckoutRequestID;

    if (!CheckoutRequestID) {
      res.status(500).json({
        message: "FAILED! Payment process failed please try again",
      });
      return;
    }

    //add order to database
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

    //Send money to the company account
    const admin_role = await ROLE.findOne({
      name: "admin",
    });

    const admin = await USER.findOne({
      role: admin_role._id,
    });

    const system_account_balance = admin.account_balance + charges;

    const updated_admin = await USER.findByIdAndUpdate(
      admin._id,
      {
        account_balance: system_account_balance,
      },
      { new: true }
    );

    //Reserve driver until the order is completed
    let designatedDriver;

    try {
      designatedDriver = await DRIVER.findByIdAndUpdate(
        driverId,
        {
          reserved: true,
        },
        { new: true }
      );
    } catch (err) {
      res.status(500).json({
        message: err,
      });
      return;
    }

    let driver = await USER.findById(designatedDriver.userId);

    /**
     * send text message to designated driver
     */
    let sms = await sendText(
      driver.phoneno,
      `You have received a translify order Request \n Login to the Application to continue`
    );

    if (!sms.message || sms.error) {
      let e = systemError.TWILIO_ERROR(sms.error.status || 401);
      res.status(e.status).json({
        message: e.message,
        error: sms.error,
      });
      return;
    }

    const orders = [order];
    const mappedOrders = await composeOrderResponseObj(orders);
    res.status(200).json(mappedOrders[0]);
  },

  async getAllOrdersByUserId(req, res) {
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
        message: `FAILED!
        We could not locate the supplied role`,
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
          message: `FAILED!
          Designated Driver not found`,
        });
        return;
      }
      orders = await ORDER.find({
        driverId: driver._id,
      });
    }
    if (!orders) {
      res.status(404).json({
        message: `FAILED! 
        No orders`,
      });
      return;
    }
    if (orders.length === 0) {
      res.status(200).json(orders);
      return;
    }
    const mappedOrders = await composeOrderResponseObj(orders);
    res.status(200).json(mappedOrders);
  },

  updateOrder: async (req, res) => {
    const { OID, status, UID } = req.body;

    // updating the order
    let order;
    try {
      order = await ORDER.findByIdAndUpdate(
        OID,
        {
          status,
        },
        { new: true }
      );
    } catch (error) {
      res.status(500).json({
        message: `FAILED! Updating order unsuccessfull`,
        error,
      });
      return;
    }

    //if null result
    if (!order) {
      res.status(404).json({
        message: `FAILED!
        order not found`,
      });
      return;
    }

    //successfull >
    //1. successfull
    const user = await USER.findById(UID);

    if (!user) {
      res.status(404).json({
        message: `FAILED!
        User not found`,
      });
      return;
    }

    const role = await ROLE.findById(user.role);

    if (!role) {
      res.status(404).json({
        message: `FAILED! We could not locate the supplied role`,
      });
    }

    const driver = await DRIVER.findById(order.driverId);
    const client = await USER.findById(order.clientId);

    if (!driver) {
      res.status(404).json({
        message: `FAILED!
        Designated Driver not found`,
      });
      return;
    }

    if (!client) {
      res.status(404).json({
        message: `FAILED!
        Client not found`,
      });
      return;
    }
    //in progress
    if (status === "in-progress") {
      /**
       * send text to client to await truck arrival
       */
      let sms = await sendText(
        client.phoneno,
        `Your Order has been confirmed \n Truck will arrive at pickup in less than 10-minutes`
      );

      if (!sms.message || sms.error) {
        let e = systemError.TWILIO_ERROR(sms.error.status || 401);
        res.status(e.status).json({
          message: e.message,
          error: sms.error,
        });
        return;
      }
    } else if (status === "successfull") {
      const admin_role = await ROLE.findOne({
        name: "admin",
      });

      const admin = await USER.findOne({
        role: admin_role._id,
      });
      const payment = order.charges * 0.9;

      //deduct the system account balance
      const system_account_balance = admin.account_balance - payment;

      let updated_admin;
      try {
        updated_admin = await USER.findByIdAndUpdate(
          admin._id,
          {
            account_balance: system_account_balance,
          },
          { new: true }
        );
      } catch (error) {
        res.status(500).json({
          message: `FAILED! 
           Transaction 001 Update unsuccessful
           `,
          error,
        });
        return;
      }

      const designated_driver = await USER.findById(driver.userId);

      //pay & unreserve the driver
      const driver_account_balance =
        designated_driver.account_balance + payment;

      let updated_driver, designatedDriver;
      try {
        updated_driver = await USER.findByIdAndUpdate(
          driver.userId,
          {
            account_balance: driver_account_balance,
          },
          { new: true }
        );
        designatedDriver = await DRIVER.findByIdAndUpdate(
          driver._id,
          {
            reserved: false,
          },
          { new: true }
        );
      } catch (error) {
        res.status(500).json({
          message: `FAILED! 
           Transaction 002 Update unsuccessful
           `,
          error,
        });
        return;
      }

      /**
       * send text message to client to confirm goods arival
       */
      let sms = await sendText(
        client.phoneno,
        `Your Goods have Arrived \n Thank you for doing bussiness with translify`
      );

      if (!sms.message || sms.error) {
        let e = systemError.TWILIO_ERROR(sms.error.status || 401);
        res.status(e.status).json({
          message: e.message,
          error: sms.error,
        });
        return;
      }
    } else if (status == "cancelled") {
      //unreserve the driver
      let designatedDriver;
      try {
        designatedDriver = await DRIVER.findByIdAndUpdate(
          driver._id,
          {
            reserved: false,
          },
          { new: true }
        );
      } catch (error) {
        res.status(500).json({
          message: "FAILED! Order Update unsuccessful",
          error,
        });
        return;
      }
      /**Alert the driver of a canclled order */
      let sms1 = await sendText(
        driver.phoneno,
        `Order: ${order.id} has been cancelled`
      );

      if (!sms1.message || sms1.error) {
        let e = systemError.TWILIO_ERROR(sms1.error.status || 401);
        res.status(e.status).json({
          message: e.message,
          error: sms1.error,
        });
        return;
      }

      /**
       * send text message to client to confirm order has been cancelled
       */
      let sms = await sendText(
        client.phoneno,
        `Order: ${order.id} has been cancelled`
      );

      if (!sms.message || sms.error) {
        let e = systemError.TWILIO_ERROR(sms.error.status || 401);
        res.status(e.status).json({
          message: e.message,
          error: sms.error,
        });
        return;
      }
    }

    let orders = null;

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

    const mappedOrders = await composeOrderResponseObj(orders);
    res.status(200).json(mappedOrders);
  },

  async reviewOrder(req, res) {
    const { userId, grade, orderId } = req.body;
    const user = await USER.findById(userId);

    if (!user) {
      res.status(404).json({
        message: `FAILED!
        User not found`,
      });
      return;
    }

    const role = await ROLE.findById(user.role);

    if (!role) {
      res.status(404).json({
        message: `FAILED! We could not locate the supplied role`,
      });
    }

    let order = await ORDER.findById(orderId);

    if (!order) {
      res.status(404).json({
        message: `FAILED! 
        Order Not Found`,
      });
      return;
    }

    let other = role.name === "client" ? "driver" : "client";

    const reviewedOrder = await ORDER.findByIdAndUpdate(
      order._id,
      {
        review: {
          [role.name]: {
            status: true,
            grade: Number(grade),
          },
          [other]: {
            status: order.review[other].status,
            grade: order.review[other].grade,
          },
        },
      },
      { new: true }
    );

    if (!reviewedOrder) {
      res.status(404).json({
        message: "FAILED! Order Update unsuccessful",
      });
      return;
    }

    let allOrders, reviewedUser;
    try {
      if (role.name === "driver") {
        reviewedUser = await USER.findById(order.clientId);
        allOrders = await ORDER.find({
          clientId: order.clientId,
        });
      } else if (role.name === "client") {
        let driver = await DRIVER.findById(order.driverId);
        reviewedUser = await USER.findById(driver.userId);
        allOrders = await ORDER.find({
          driverId: driver._id,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "FAILED! USER Update unsuccessful",
        error,
      });
      return;
    }

    //update the rating of a reviewed user;
    let ratedUser = await USER.findByIdAndUpdate(
      reviewedUser._id,
      {
        rating: averageRating(allOrders, role.name),
      },
      { new: true }
    );

    if (!ratedUser) {
      res.status(404).json({
        message: "FAILED! USER not found",
      });
      return;
    }

    const structuredOrders = await composeOrderResponseObj([reviewedOrder]);
    res.status(200).json(structuredOrders[0]);
  },
};
