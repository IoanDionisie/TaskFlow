
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.SECRET_KEY;

module.exports = {
  secret: secretKey
};