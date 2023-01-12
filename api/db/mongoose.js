// This file will handle connection logic to the MongoDB database
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

var username = process.env.USER;
const password = process.env.PASSWD;
const cluster = process.env.CLUSTER;

const localUri = `mongodb://localhost:27017/TasksManager`;
const uri = `mongodb+srv://${username}:${password}@${cluster}`;

// Change the localUri with uri if you want to connect to the cloud database
mongoose.connect(localUri, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (!err) console.log("db connected");
    else console.log("db error", err);
});

module.exports = { mongoose };