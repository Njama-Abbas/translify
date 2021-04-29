const bcrypt = require("bcrypt");
const clients = [
  {
    firstname: "Jayson",
    lastname: "Bourne",
    phoneno: "723664497",
    email: "jason@gmail.com",
  },
  {
    firstname: "Iano",
    lastname: "Somerhalder",
    phoneno: "741235678",
    email: "iano@gmail.com",
  },
  {
    firstname: "Nina",
    lastname: "Dobrev",
    phoneno: "742134567",
    email: "nina@gmail.com",
  },
  {
    firstname: "Katty",
    lastname: "Graham",
    phoneno: "743125678",
    email: "katty@gmail.com",
  },
  {
    firstname: "Kayla",
    lastname: "Ewell",
    phoneno: "744789765",
    email: "ewell@gmail.com",
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
