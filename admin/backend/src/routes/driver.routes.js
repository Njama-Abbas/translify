const controller = require("../controllers/driver.controller");

module.exports = function (app) {
  app.post("/drivers", controller.create);

  app.get("/drivers", controller.fetch);

  app.get("/drivers/:id", controller.get);

  app.put("/drivers/:id", controller.update);

  app.delete("/drivers/:id", controller.delete);
};
