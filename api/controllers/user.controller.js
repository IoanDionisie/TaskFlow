const { User } = require('../db/models/user.model');

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

/** 
 * Purpose: Gets a list with al users currently registered
 */
async function getUsers(req, res) {
    await User.find().then((users) => {
        res.send(users)
    })
}

exports.getUsers = getUsers;