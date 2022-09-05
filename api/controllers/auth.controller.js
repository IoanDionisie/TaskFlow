const config = require("../config/auth.config");
const { User } = require('../db/models/user.model');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    var user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
     
        user.save(err => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.send({ message: "User was registered successfully!" });
        });
    });
};

exports.currentUser = (req, res) => {
  var currUser = req.user;
  return currUser;
}

exports.changePassword = (req, res) => {
  var updatedUser = {
    password: bcrypt.hashSync(req.body.password, 8)
  }

  User.findOneAndUpdate({username: req.body.username}, updatedUser).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({message: "Password updated with success!"});
  });
};

exports.signin = (req, res) => {
    User.findOne({
      username: req.body.username
    }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
        
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          accessToken: token
        });
      });
};