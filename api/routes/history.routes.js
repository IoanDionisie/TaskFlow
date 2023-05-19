const controller = require("../controllers/history.controller");

module.exports = function(app) {
  app.get("/history", controller.getHistory);
  app.post('/addHistoryItem', controller.addHistoryItem);
};
