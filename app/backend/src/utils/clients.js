const bcrypt = require("bcrypt");
const clients = [
  {
    firstname: "Jayson",
    lastname: "Bourne",
    phoneno: "0723664497",
    email: "jason@gmail.com",
  },
  {
    firstname: "Iano",
    lastname: "Somerhalder",
    phoneno: "0741235678",
    email: "iano@gmail.com",
  },
  {
    firstname: "Nina",
    lastname: "Dobrev",
    phoneno: "0742134567",
    email: "nina@gmail.com",
  },
  {
    firstname: "Katty",
    lastname: "Graham",
    phoneno: "0743125678",
    email: "katty@gmail.com",
  },
  {
    firstname: "Kayla",
    lastname: "Ewell",
    phoneno: "0744789765",
    email: "ewell@gmail.com",
  },
];

const sample_clients = clients.map((client) => ({
  ...client,
  password: bcrypt.hashSync("123Asd", 10),
  verification: {
    status: true,
    code: 10801080,
  },
}));

module.exports = sample_clients;
