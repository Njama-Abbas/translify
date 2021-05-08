const db = require("../models");
const ROLE = db.role;
const USER = db.user;
const DRIVER = db.driver;
const bcrypt = require("bcrypt");

const sample_drivers = require("./drivers");
const sample_clients = require("./clients");

exports.createSampleUsers = function () {
  USER.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
      const client_role = await ROLE.findOne({
        name: "client",
      });

      const $sample_clients = await Promise.all(
        sample_clients.map(async (client) => {
          const c1 = await USER.create({
            ...client,
            role: client_role._id,
          });
          const c2 = await c1.save();
          return true;
        })
      );

      if ($sample_clients.every(Boolean)) {
        console.log("SAMPLE 'CLIENTS' CREATED");
      }

      const driver_role = await ROLE.findOne({
        name: "driver",
      });

      const approved_drivers = await Promise.all(
        sample_drivers.approved.map(async (driver) => {
          const d1 = await USER.create({
            ...driver.personal_details,
            role: driver_role._id,
          });
          const d2 = await d1.save();

          const d3 = await DRIVER.create({
            userId: d2._id,
            ...driver.driving_details,
            approval_status: "A",
          });
          const d4 = await d3.save();
          return true;
        })
      );
      const declined_drivers = await Promise.all(
        sample_drivers.declined.map(async (driver) => {
          const d1 = await USER.create({
            ...driver.personal_details,
            role: driver_role._id,
          });
          const d2 = await d1.save();

          const d3 = await DRIVER.create({
            userId: d2._id,
            ...driver.driving_details,
            approval_status: "D",
          });
          await d3.save();
          return true;
        })
      );

      const pending_drivers = await Promise.all(
        sample_drivers.pending.map(async (driver) => {
          const d1 = await USER.create({
            ...driver.personal_details,
            role: driver_role._id,
          });
          const d2 = await d1.save();

          const d3 = await DRIVER.create({
            userId: d2._id,
            ...driver.driving_details,
            approval_status: "P",
          });
          const d4 = await d3.save();
          return true;
        })
      );

      const all_created = [
        approved_drivers.every(Boolean),
        declined_drivers.every(Boolean),
        pending_drivers.every(Boolean),
      ].every(Boolean);

      if (all_created) {
        console.log("SAMPLE 'DRIVERS' CREATED");
      }

      const admin_role = await ROLE.findOne({
        name: "admin",
      });

      const sample_admin = await USER.create({
        firstname: "Priyanka",
        lastname: "Chopra",
        phoneno: "254701010101",
        username: "priyanka",
        password: bcrypt.hashSync("123Asd", 10),
        role: admin_role._id,
        account_balance: 100000,
      });
      await sample_admin.save();
      console.log("Default 'ADMIN' created");
      console.log("PROCEED.STATUS == 200");
    }
  });
};
