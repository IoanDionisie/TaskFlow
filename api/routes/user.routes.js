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
  app.get("/api/isAdmin", controller.isAdmin);
};