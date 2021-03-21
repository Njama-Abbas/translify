const controller = require("../controllers/client.controller");

module.exports = function (app) {
  app.post("/clients", controller.create);

  app.get("/clients", controller.fetch);

  app.get("/clients/:id", controller.get);

  app.delete("/clients/:id", controller.delete);
};
