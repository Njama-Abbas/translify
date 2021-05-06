const _ = require("lodash");

const db = require("../models");
const USER = db.user,
  DRIVER = db.driver,
  ORDER = db.order;

module.exports = {
  composeUserResponseObj(user, role) {
    return {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneno: user.phoneno,
      rating: user.rating,
      role: role.name,
      verification: user.verification,
      id: user.id,
    };
  },

  /**
   *
   * @param {[]} orders
   * @returns {[]} an array of orders mapped with relevant details
   */

  async composeOrderResponseObj(orders) {
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
          review,
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

        const extractGrade = (role) =>
          review[role].status ? review[role].grade : null;

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
          review: {
            client: extractGrade("client"),
            driver: extractGrade("driver"),
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
  },
  averageRating(orders, rolename) {
    let reviewedOrders = orders.filter(
      (order) => order.review[rolename].status
    );
    let avgRating = 0;
    if (reviewedOrders.length) {
      avgRating = _.meanBy(reviewedOrders, (o) => o.review[rolename].grade);
    }
    return _.round(avgRating, 1);
  },
};
