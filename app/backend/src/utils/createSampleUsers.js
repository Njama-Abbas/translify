const db = require("../models");
const Role = db.role;
const User = db.user;
const Driver = db.driver;
const bcrypt = require("bcrypt");

const sample_drivers = require("./drivers");

exports.createSampleUsers = function () {
  User.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
      const client_role = await Role.findOne({
        name: "client",
      });

      const sample_client = await User.create({
        firstname: "Jayson",
        lastname: "Bourne",
        phoneno: "0723664497",
        email: "jason@gmail.com",
        password: bcrypt.hashSync("123Asd", 10),
        verification: {
          status: true,
          code: 10801080,
        },
        role: client_role._id,
      });

      await sample_client.save();
      console.log("Sample 'Client' Created");

      const driver_role = await Role.findOne({
        name: "driver",
      });

      const approved_drivers = await Promise.all(
        sample_drivers.approved.map(async (driver) => {
          const d1 = await User.create({
            ...driver.personal_details,
            role: driver_role._id,
          });
          const d2 = await d1.save();

          const d3 = await Driver.create({
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
          const d1 = await User.create({
            ...driver.personal_details,
            role: driver_role._id,
          });
          const d2 = await d1.save();

          const d3 = await Driver.create({
            userId: d2._id,
            ...driver.driving_details,
            approval_status: "D",
          });
          const d4 = await d3.save();
          return true;
        })
      );

      const pending_drivers = await Promise.all(
        sample_drivers.pending.map(async (driver) => {
          const d1 = await User.create({
            ...driver.personal_details,
            role: driver_role._id,
          });
          const d2 = await d1.save();

          const d3 = await Driver.create({
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
        console.log("SAMPLE DRIVERS CREATED");
      }

      const admin_role = await Role.findOne({
        name: "admin",
      });

      const sample_admin = await User.create({
        firstname: "Priyanka",
        lastname: "Chopra",
        phoneno: "0712345678",
        email: "priyanka@gmail.com",
        password: bcrypt.hashSync("123Asd", 10),
        role: admin_role._id,
      });
      await sample_admin.save();
      console.log("Default 'ADMIN' created");
      console.log("PROCEED.STATUS == 200");
    }
  });
};
