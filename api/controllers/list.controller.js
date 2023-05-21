const { authJwt } = require('../middleware');
const { List } = require('../db/models/list.model');
const { Task } = require('../db/models/task.model');
const history = require('./history.controller');


/**
 * Purpose: Gets all lists for the logged in user
 */
async function getLists(req, res) {
    try {
        let userId = authJwt.getUserId(req);
        await List.find({userId: userId}).then((lists) => {
            return res.send(lists);
        })
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Update a specified list
 */
async function updateList(req, res) {
    try {
        let id = req.params.id;
        await List.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            observations: req.body.observations,
            dateCompleted: req.body.dateCompleted
        });

        history.addHistoryItem(req, req.body, arguments.callee.name);
        res.status(200).send({});
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Create a new list
 */
async function createList(req, res) {
    try {
        let userId = authJwt.getUserId(req);
        let newList = new List({
            title: req.body.title,
            description: req.body.description,
            dateCreated: req.body.dateCreated,
            userId: userId,
            status: "In Progress"
        });

        newList.save().then((listDoc) => {
            res.send(listDoc)
            history.addHistoryItem(req, req.body, arguments.callee.name);
        });
    } catch(err) {
        returnError(err, res);
    }
}

/**

 * Purpose: Delete a list
 */
async function deleteList(req, res) {
    try {
        let id = req.params.id;
        await Task.deleteMany({
            _listId: id
        })

        let deletedList = await List.findById(id);
        await List.findOneAndDelete({
            _id: id
        }).then((list) => {
          deletedList = list;
        });

        history.addHistoryItem(req, deletedList, arguments.callee.name);
        res.status(200).send({});
    } catch(err) {
        returnError(err, res);
    }
}


function returnError(err, res) {
    console.log(err);
    return res.status(500).json({
        message : "Internal server error!"
    })
}

exports.getLists = getLists;
exports.updateList = updateList;
exports.createList = createList;
exports.deleteList = deleteList;
