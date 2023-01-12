// This file will handle connection logic to the MongoDB database
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

var username = process.env.USER;
const password = process.env.PASSWD;
const cluster = process.env.CLUSTER;

const uri = `mongodb+srv://${username}:${password}@${cluster}`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (!err) console.log("db connected");
    else console.log("db error", err);
});

module.exports = { mongoose };