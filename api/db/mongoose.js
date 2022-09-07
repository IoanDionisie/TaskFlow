// This file will handle connection logic to the MongoDB database
const mongoose = require('mongoose');

const username = "ioanciuciu";
const password = "Masterfreud1349";
const cluster = "firstcluster.y4ujd";
const dbname = "TasksManager";

//`mongodb+srv://${username{}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`
mongoose.connect('mongodb://localhost:27017/TasksManager', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (!err) console.log("db connected");
    else console.log("db error", err);
});

module.exports = { mongoose };