const express = require('express');
const cors = require("cors");
const app = express();

/*

var corsOptions = {
    origin: "http://localhost:3000"
};
app.use(cors(corsOptions));
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const { User } = require('./db/models/user.model');
const { Tag } = require('./db/models/tag.model');
const { authJwt } = require('./middleware');

// Load middleware
app.use(bodyParser.json());


/* Route handlers */
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

/* List routes */

/** 
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    let userId = authJwt.getUserId(req);

    // We want to return an array of all the lists in the database for the logged in user
    List.find({userId: userId}).then((lists) => {
        res.send(lists);
    })
})
/** 
 * POST /lists
 * Purpose: Create a new list
 */
app.post('/lists', (req, res) => {
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
    });

})

/** 
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', async (req, res) => {
    // We want to update the specified list with the new values specified in the JSON body of the request
    let id = req.params.id;
    await List.findByIdAndUpdate(id, {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        observations: req.body.observations,
        dateCompleted: req.body.dateCompleted
    });  
    res.status(200).send({});
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
        tags: req.body.tags,
        order: lastTask != null ? lastTask.order + 1 : 0
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
 * Purpose: Modifies an existing task
 */
 app.patch('/lists/:listId/tasks/:taskId', async (req, res) => {
    // We want to update an existing task speficied by taskId 
    await Task.findByIdAndUpdate(
        req.params.taskId, {
            title: req.body.title,
            description: req.body.description,
            dateCompleted: req.body.dateCompleted,
            status: req.body.status,
            observations: req.body.observations,
            dateStarted: req.body.dateStarted,
            tags: req.body.tags,
            isStarted: req.body.isStarted
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

/** 
 * POST /tags
 * Purpose: Create a new tag
 */
 app.post('/tags', (req, res) => {
    let userId = authJwt.getUserId(req);

    let newTag = new Tag({
        title: req.body.title,
        color: req.body.color,
        userId: userId,
    });

    newTag.save().then((tag) => {
        res.send(tag)
    });
})

/** 
 * GET /users/
 * Purpose: Get a list of all users
 */
 app.get('/users', (req, res) => {
     User.find().then((users) => {
        res.send(users)
     })
})

/** 
 * DELETE /tags/:id
 * Purpose: Delete a tag
 */
 app.delete('/tags/:id', async (req, res) => {
    // We want to delete the specified tag 
    let tagId = req.params.id;
    await Tag.findOneAndDelete({
        _id: tagId
    });
   
    res.status(200).send({});
})

/** 
 * GET /tags/
 * Purpose: Get a list of all tags for the currently logged user
 */
 app.get('/tags', (req, res) => {
    let userId = authJwt.getUserId(req);

    Tag.find({userId: userId}).then((tags) => {
       res.send(tags)
    })
})

app.listen(3000, () => {
    console.log("App listening on port 3000");
});

