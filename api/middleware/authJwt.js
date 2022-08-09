const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const db = require("../db/models");
const user = require("../db/models/user.model")

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
};

getUserId = (req, res) => {
  let token = req.headers["x-access-token"];
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
    });
    
    return req.userId;
}

const authJwt = {
    verifyToken, getUserId
};

module.exports = authJwt;