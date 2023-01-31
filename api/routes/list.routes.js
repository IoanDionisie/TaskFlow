const controller = require("../controllers/list.controller");

module.exports = function(app) {
  app.get("/lists", controller.getLists);
  app.post("/lists", controller.createList);    
  app.patch("/lists/:id", controller.updateList);
  app.delete("/lists/:id", controller.deleteList);
};