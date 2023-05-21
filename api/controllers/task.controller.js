const { isNamedExportBindings } = require('typescript');
const { Task } = require('../db/models/task.model');
const { WorkingDates } = require('../db/models/workingDates.model');
const history = require('./history.controller');

/**
 * Purpose: Gets a specific task by id
 */
async function getTask(req, res) {
    try {
        await Task.findOne({
            _id: req.params.taskId,
            _listId: req.params.listId
        }).then((task) => {
            res.send(task);
        })
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Gets tasks from a specific list
 */
async function getTasks(req, res) {
    try {
        let id = req.params.id;
        await Task.find({
            _listId: id
        }).sort({order: "desc"}).then((tasks) => {
            res.send(tasks);
        });
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Adds a task in the specified list
 */
async function addTask(req, res) {
    try {
        let lastTask = await Task.findOne().sort({"order": -1});
        let sortedTags = req.body.tags;
        if (sortedTags) {
            sortedTags.sort((a, b) => a.title.localeCompare(b.title));
        }

        let task = new Task({
            title: req.body.title,
            _listId:  req.params.id,
            status: req.body.status,
            description: req.body.description,
            dateCreated: req.body.dateCreated,
            estimation: req.body.estimation,
            tags: sortedTags,
            order: lastTask != null ? lastTask.order + 1 : 0
        })

        await task.save().then((taskDoc) => {
            history.addHistoryItem(req, req.body, arguments.callee.name);
            res.send(taskDoc);
        })
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Clones a task in the specified list
 */
async function cloneTask(req, res) {
    try {
        let lastTask = await Task.findOne().sort({"order": -1});
        let clonedTask =  await Task.findById(req.body.taskId);
        let newTitle = clonedTask.title + " (copy)";
        let task = new Task({
            title: newTitle,
            _listId:  req.body.listId,
            status: clonedTask.status,
            description: clonedTask.description,
            dateCreated: req.body.dateCreated,
            estimation: clonedTask.estimation,
            tags: clonedTask.tags,
            order: lastTask != null ? lastTask.order + 1 : 0,
        })
        await task.save().then((taskDoc) => {
            history.addHistoryItem(req, clonedTask, arguments.callee.name);
            res.send(taskDoc);
        })
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Updates a task in the specified list
 */
async function updateTask(req, res) {
    try {
        let sortedTags = req.body.tags;
        if (sortedTags) {
            sortedTags.sort((a, b) => a.title.localeCompare(b.title));
        }

        let updatedTask;
        await Task.findByIdAndUpdate(
        req.params.taskId, {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            observations: req.body.observations,
            estimation: req.body.estimation,
            tags: sortedTags,
            isStarted: req.body.isStarted
        }).then((task) => {
          updatedTask = task;
        })

        history.addHistoryItem(req, updatedTask, arguments.callee.name);
        res.status(200).send(req.body);
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Updates a task's work intervals in the specified list
 */
async function updateTaskWorkIntervals(req, res) {
    try {
        let interval = new WorkingDates({
            date: req.body.date,
            type: req.body.isStarted
        });
        var workIntervals = req.body.workIntervals;
        if (!workIntervals) {
            workIntervals = [];
            workIntervals.push(interval);
        } else {
            workIntervals.push(interval);
        }
        await Task.findByIdAndUpdate( req.params.taskId, {
            dateCompleted: req.body.date,
            status: req.body.status,
            isStarted: req.body.isStarted,
            workIntervals: workIntervals,
            totalWorkingTime: req.body.totalWorkingTime
        })
        res.send(workIntervals);
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Reorders tasks in the specified list
 */
async function reorderTasks(req, res) {
    try {
        let tasks = req.body.ids;
        let counter = tasks.length;
        for (let i = 0; i < tasks.length; i++) {
            counter -= 1;
            await Task.findByIdAndUpdate(tasks[i], {
                order: counter
            });
        }
        res.status(200).send({});
    } catch(err) {
        returnError(err, res);
    }
}

/**
 * Purpose: Deletes a task in the specified list
 */
async function deleteTask(req, res) {
    try {
        await Task.findOneAndDelete({
            _id: req.params.taskId,
            _listId: req.params.listId
        }).then((removedTaskDocument) => {
            history.addHistoryItem(req, removedTaskDocument, arguments.callee.name);
            res.send(removedTaskDocument);
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

exports.getTask = getTask;
exports.getTasks = getTasks;
exports.addTask = addTask;
exports.cloneTask = cloneTask;
exports.updateTask = updateTask;
exports.updateTaskWorkIntervals = updateTaskWorkIntervals;
exports.reorderTasks = reorderTasks;
exports.deleteTask = deleteTask;
