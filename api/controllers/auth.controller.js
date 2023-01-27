const config = require("../config/auth.config");
const { User } = require('../db/models/user.model');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
var session = require('express-session');

dotenv.config();

const mail = process.env.EMAIL;
const mailPass = process.env.EMAIL_PASS;
const sitepage = process.env.SITEPAGE;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
   user: mail,
   pass: mailPass,
  },
})

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

async function sendResetPasswordLink(req, res) {
  try {
    //find a document with such email address
    const user = await User.findOne({email : req.body.email})
    //check if user object is not empty
    if(user) {
        const hash = new User(user).generatePasswordResetHash();
        const resetLink = `${sitepage}/newpassword?email=${user.email}&hash=${hash}`;
        const options = {
          from: 'support@taskflowapp.com',
          to: user.email,
          subject: "Link for resetting password",
          text: resetLink
        }

        transporter.sendMail(options);
        return res.status(200).json({});
    }else{
        return res.status(400).json({
            message : "Email Address is invalid!"
        })
    } 
  } catch(err) {
      console.log(err);
      return res.status(500).json({
          message : "Internal server error!"
      })
  }
}

async function checkResetPasswordLink(req, res) {
  try {
      //check for email and hash in query parameter
      if (req.query && req.query.email && req.query.hash) {
          const user = await User.findOne({ email: req.query.email });
          if (user) {
              if (new User(user).verifyPasswordResetHash(req.query.hash)) {
                return res.status(200).json({
                  message: "Reset link is valid",
                  email: req.query.email
              })
            } else {
                return res.status(400).json({
                  message: "You have provided an invalid reset link!"
                })
            }
          } else {
              return res.status(400).json({
                message: "You have provided an invalid reset link!"
              })
          }
      } else {
          //if there are no query parameters, serve the normal request form
          return res.status(400).json({response: "You have provided an invalid reset link!"})
      }
  } catch (err) {
      console.log(err)
      return res.status(500).json({
          message: "Internal server error!"
      })
  }
}


exports.sendResetPasswordLink = sendResetPasswordLink;
exports.checkResetPasswordLink = checkResetPasswordLink;

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

exports.googleSignIn = function(user) {
  var token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400 // 24 hours
  });

  let obj = {
    id: user._id,
    username: user.username,
    accessToken: token
  }
}

exports.changePasswordUsingMail = (req, res) => {
  var updatedUser = {
    password: bcrypt.hashSync(req.body.password, 8)
  }
  User.findOneAndUpdate({email: req.body.email}, updatedUser).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({message: "Password updated with success!"});
  });
};