const { authJwt } = require('../middleware');
const { List } = require('../db/models/list.model');
const { Task } = require('../db/models/task.model');
const { HistoryItem } = require('../db/models');


/**
 * Purpose: Gets all history items from the database
 */
async function getHistory(req, res) {
 // console.log(arguments.callee.name)
    try {
        let userId = authJwt.getUserId(req);
        await HistoryItem.find().then((items) => {
            return res.send(items);
        })
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Adds a new history item
 */
async function addHistoryItem(req, object) {
  try {
    let userId = authJwt.getUserId(req);
    let historyItem = new HistoryItem({
      userId: userId,
      action: object.title,
      actionObject: object
    });

    historyItem.save().then((item) => {
      console.log("added history item!");
    });
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

exports.getHistory = getHistory;
exports.addHistoryItem = addHistoryItem;
