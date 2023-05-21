const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  role: {
    type: String,
    required: false
  }
});

const HistoryItemSchema = new mongoose.Schema({
    user: {
        type: UserSchema
    },
    action: {
        type: String
    },
    actionObject: {
      type: Object
    }
});


const HistoryItem = mongoose.model('historyItem', HistoryItemSchema);

module.exports = { HistoryItem }
