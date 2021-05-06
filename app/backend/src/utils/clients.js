const bcrypt = require("bcrypt");
const clients = [
  {
    firstname: "Jayson",
    lastname: "Bourne",
    phoneno: "723664497",
    username: "jayson",
  },
  {
    firstname: "Iano",
    lastname: "Somerhalder",
    phoneno: "741235678",
    username: "iano_some",
  },
  {
    firstname: "Nina",
    lastname: "Dobrev",
    phoneno: "742134567",
    username: "nina-dobrev",
  },
  {
    firstname: "Katty",
    lastname: "Graham",
    phoneno: "743125678",
    username: "katty_graham",
  },
  {
    firstname: "Kayla",
    lastname: "Ewell",
    phoneno: "744789765",
    username: "ewellKylla",
  },
];

const sample_clients = clients.map((client) => ({
  ...client,
  password: bcrypt.hashSync("123Asd", 10),
  phoneno: "254" + client.phoneno,
  verification: {
    status: true,
    code: 10801080,
  },
}));

module.exports = sample_clients;
