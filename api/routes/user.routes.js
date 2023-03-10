const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/all", controller.allAccess);
  app.get("/api/user", [authJwt.verifyToken], controller.userBoard);
  app.get("/api/users", controller.getUsers);
  app.get("/api/userRole", controller.userRole);

  app.patch("/api/giveAdminRights/:id", controller.giveAdminRights);
  app.patch("/api/removeAdminRights/:id", controller.removeAdminRights);

  app.delete("/api/deleteUser/:id", controller.deleteUser);
};