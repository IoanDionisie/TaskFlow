const { User } = require('../db/models/user.model');
const { authJwt } = require('../middleware');

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

async function isAdmin (req, res) {
    try {
        let userId = authJwt.getUserId(req);
        await User.findById({_id: userId}).then((user) => {
            res.send(user.role == "admin");
        })
    } catch(err) {
        returnError(err, res);
    }
}

/** 
 * Purpose: Gets a list with al users currently registered
 */
async function getUsers(req, res) {
    await User.find().then((users) => {
        res.send(users)
    })
}

function returnError(err, res) {
    console.log(err);
    return res.status(500).json({
        message : "Internal server error!"
    })
}

exports.getUsers = getUsers;
exports.isAdmin = isAdmin;