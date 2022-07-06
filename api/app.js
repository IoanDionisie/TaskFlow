const express = require('express');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
    next();
});

const mongoose  = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { List } = require('./db/models/list.model');
const { Task } = require('./db/models/task.model');

// Load middleware
app.use(bodyParser.json());

/* Route handlers */

/* List routes */

/** 
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // We want to return an array of all the lists in the database
    List.find({}).then((lists) => {
         res.send(lists);
    })
})

/** 
 * POST /lists
 * Purpose: Create a new list
 */
app.post('/lists', (req, res) => {
    // We want to create a new list and to return the new list document to the user
    // The list information will be passed via JSON request body
    let title = req.body.title;

    let newList = new List({
        title
    });

    newList.save().then((listDoc) => {
        res.send(listDoc)
    });

})

/** 
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', (req, res) => {
    // We want to update the specified list with the new values specified in the JSON body of the request
    let title = req.body.title;
    let id = req.params.id;

    List.findOneAndUpdate( {_id: id}, {
        $set: req.body
    }).then(() => {  
        res.sendStatus(200)
    });
})

/** 
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete('/lists/:id', async (req, res) => {
    // We want to delete the specified list 
    let id = req.params.id;
    
    await Task.deleteMany({
        _listId: id
    })

    await List.findOneAndDelete({
        _id: id
    });
   
    res.status(200).send({});
})

/** 
 * GET /lists/:id/tasks
 * Purpose: Get all tasks in a specific list
 */
app.get('/lists/:id/tasks', (req, res) => {
    let id = req.params.id;

    Task.find({
        _listId: id
    }).sort({order: "desc"}).then((tasks) => {
        res.send(tasks);
    });
})

/** 
 * POST /lists/:id/tasks
 * Purpose: Add a new task in the specified list
 */
app.post('/lists/:id/tasks', async (req, res) => {
    //  We want to create a new task in the specified list
    let lastTask = await Task.findOne().sort({"order": -1});
    let task = new Task({
        title: req.body.title,
        _listId:  req.params.id,
        status: req.body.status,
        description: req.body.description,
        dateCreated: req.body.dateCreated,
        order: lastTask.order + 1
    })

    task.save().then((taskDoc) => {
        res.send(taskDoc);
    })    
})

/** 
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete an existing task
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to delete a task from the specified list 

    Task.findOneAndDelete({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDocument) => {
        res.send(removedTaskDocument);
    });
})

/** 
 * GET /lists/:listId/tasks/:taskId
 * Purpose: Get an existing task
 */
app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
})

/** 
 * PATCH /lists/:id/tasks
 * Purpose: Updates an existing task
 */
 app.patch('/lists/:listId/tasks/:taskId', async (req, res) => {
    // We want to update an existing task speficied by taskId 
    await Task.findByIdAndUpdate(
        req.params.taskId, {
            title: req.body.title,
            description: req.body.description,
            dateCompleted: req.body.dateCompleted,
            status: req.body.status
        })
    res.status(200).send({});
})

/** 
 * PATCH /lists/:id/tasks
 * Purpose: Modifies a list of tasks (reorder)
 */
 app.patch('/lists/:listId/reorderTasks', async (req, res) => {
    let tasks = req.body.ids;
    let counter = tasks.length;
    for (let i = 0; i < tasks.length; i++) {
        counter -= 1;
        await Task.findByIdAndUpdate(tasks[i], {
            order: counter
        });
    }   
    res.status(200).send({});
})

app.listen(3000, () => {
    console.log("App listening on port 3000");
});

