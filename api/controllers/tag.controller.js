const { authJwt } = require('../middleware');
const { List } = require('../db/models/list.model');
const { Task } = require('../db/models/task.model');
const { Tag } = require('../db/models/tag.model');


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

        let newTag = new Tag({
            title: req.body.title,
            color: req.body.color,
            userId: userId,
        });
    
        await newTag.save().then((tag) => {
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
        await Tag.findOneAndDelete({
            _id: tagId
        });
    
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
        await Tag.deleteMany({userId: userId});
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
