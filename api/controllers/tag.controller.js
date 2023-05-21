const { authJwt } = require('../middleware');
const { List } = require('../db/models/list.model');
const { Task } = require('../db/models/task.model');
const { Tag } = require('../db/models/tag.model');
const history = require('./history.controller');

/**
 * Purpose: Gets all tags for the logged in user
 */
async function getTags(req, res) {
    try {
        let userId = authJwt.getUserId(req);
        await Tag.find({userId: userId}).then((tags) => {
           res.send(tags)
        })
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Adds a new tag for the logged in user
 */
async function addTag(req, res) {
    try {
        let userId = authJwt.getUserId(req);

        let userTags = await Tag.find({userId: userId});

        for (tag of userTags) {
            if (tag.title == req.body.title) {
                return res.status(400).json({
                    message : "Tag already exists!"
                });
            }
        }

        let newTag = new Tag({
            title: req.body.title,
            color: req.body.color,
            userId: userId,
        });

        await newTag.save().then((tag) => {
          history.addHistoryItem(req, req.body, arguments.callee.name);
          res.send(tag)
        });
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Gets all tags for the logged in user
 */
async function deleteTag(req, res) {
    try {
        let tagId = req.params.id;

        let deletedTag;
        await Tag.findOneAndDelete({
            _id: tagId
        }).then((tag) => {
          deletedTag = tag;
        });

        history.addHistoryItem(req, deletedTag, arguments.callee.name);
        res.status(200).send({});
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Deletes all tags for the logged in user
 */
async function deleteAllTags(req, res) {
    try {
        let userId = authJwt.getUserId(req);
       // await Tag.deleteMany({userId: userId});
        history.addHistoryItem(req, null, arguments.callee.name);
        res.status(200).send({});
    } catch(err) {
        returnError(err, res);
    }
}

async function updateTag(req, res) {
    try {
        let tagId = req.params.id;
        let userId = authJwt.getUserId(req);
        let updatedTag;

        await Tag.findByIdAndUpdate(tagId, {
            color: req.body.color
        }).then((tag) => {
          updatedTag = tag;
        });

        var tasks = await Task.find({userId: userId});

        for (task of tasks) {
            let tagList = task.tags;
            for (tag of task.tags) {
                if (tag._id == tagId) {
                    tag.color = req.body.color;
                    await Task.updateOne({_id: task._id}, {
                        tags: tagList
                    });
                }
            }
        }

        history.addHistoryItem(req, updatedTag, arguments.callee.name);
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

exports.getTags = getTags;
exports.addTag = addTag;
exports.deleteTag = deleteTag;
exports.deleteAllTags = deleteAllTags;
exports.updateTag = updateTag;
