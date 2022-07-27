const { List } = require('./list.model');
const { Task } = require('./task.model');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.user = require("./user.model");

module.exports = {
    List,
    Task,
    db
}
