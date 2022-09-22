const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: false
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = { User };
