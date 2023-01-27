const mongoose = require("mongoose");
var crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    googleId: {
      type: String,
      require: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    role: {
      type: String,
      required: false
    }
});

//generate password reset hash
UserSchema.methods.generatePasswordResetHash = function() {
  const resetHash = crypto.createHash('sha512').update(this.password).digest('hex');
  return resetHash;
}

//verify password reset hash
UserSchema.methods.verifyPasswordResetHash = function(resetHash = undefined) {
  return this.generatePasswordResetHash() === resetHash;
}

const User = mongoose.model('user', UserSchema);
module.exports = { User };
