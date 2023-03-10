const { User } = require('../db/models/user.model');
const { authJwt } = require('../middleware');

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

/** 
 * Purpose: Gets user's role for this app
 */
async function userRole (req, res) {
    try {
        let userId = authJwt.getUserId(req);
        await User.findById({_id: userId}).then((user) => {
            res.send(user.role);
        })
    } catch(err) {
        returnError(err, res);
    }
}

/** 
 * Purpose: Gets a list with al users currently registered
 */
async function getUsers(req, res) {
    try {
        let userId = authJwt.getUserId(req);
        await User.find().then((users) => {
            res.send(users)
        })
    } catch(err) {
        returnError(err, res);
    }
}

/** 
 * Purpose: Gives an user admin rights
 */
async function giveAdminRights(req, res) {
    try {
        let userId = req.params.id;
        await User.findByIdAndUpdate(userId, {
            role: "admin"
        });
        res.status(200).send({});
    } catch(err) {
        returnError(err, res);
    }
}

/** 
 * Purpose: Removes the admin role for an user
 */
async function removeAdminRights(req, res) {
    try {
        let userId = req.params.id;
        await User.findByIdAndUpdate(userId, {
            role: "user"
        });
        res.status(200).send({});
    } catch(err) {
        returnError(err, res);
    }
}

/** 
 * Purpose: Deletes an user and all its data (TODO)
 */
async function deleteUser(req, res) {
    try {
        let userId = req.params.id;
        await User.findOneAndDelete({_id: userId});
        res.status(200).send({});
    } catch(err) {
        returnError(err, res);
    }
}

/* Used for testing */
async function initUsers(req, res) {
    var users;
    await User.find().then((response) =>
        users = response
    )
    console.log(users);
    for (var i = 0; i < users.length; ++i) {
        await User.findByIdAndUpdate(users[i]._id, {
            role: "user"
        })
    }
}

function returnError(err, res) {
    console.log(err);
    return res.status(500).json({
        message : "Internal server error!"
    })
}

exports.getUsers = getUsers;
exports.userRole = userRole;
exports.deleteUser = deleteUser;
exports.removeAdminRights = removeAdminRights;
exports.giveAdminRights = giveAdminRights;