const { authJwt } = require('../middleware');
const { List } = require('../db/models/list.model');
const { Task } = require('../db/models/task.model');
const { User } = require('../db/models/user.model');
const { HistoryItem } = require('../db/models');
const { historyItemAction } = require('../constants/historyItemAction');


/**
 * Purpose: Gets all history items from the database
 */
async function getHistory(req, res) {
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
 * Purpose: Removes all the history from the database
 */
async function removeHistory(req, res) {
  try {
    await HistoryItem.deleteMany().then((res) => {
      return res.send("Items removed");
    })
  } catch(err) {
      returnError(err, res);
  }
}

/**
 * Purpose: Adds a new history item
 */
async function addHistoryItem(req, object, action) {
  let userId = authJwt.getUserId(req);
  let user;
  await User.findById(userId).then((item) => {
    user = item;
  });
  console.log(user);

  let historyItem = new HistoryItem({
    user: user,
    action: historyItemAction[action],
    actionObject: object
  });

  historyItem.save().then((item) => {
    console.log("added history item!");
  });
}


function returnError(err) {
  console.log(err);
  return res.status(500).json({
      message : "Internal server error!"
  })
}

exports.getHistory = getHistory;
exports.addHistoryItem = addHistoryItem;
