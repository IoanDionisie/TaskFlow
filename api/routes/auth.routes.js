const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/changePassword", controller.changePassword);
  app.post("/api/auth/changePasswordUsingMail", controller.changePasswordUsingMail);
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/sendResetPasswordLink", controller.sendResetPasswordLink);
  app.get('/api/auth/checkResetPasswordLink', controller.checkResetPasswordLink);
};