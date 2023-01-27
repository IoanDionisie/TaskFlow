const express = require('express');
const cors = require("cors");
const app = express();
const fs = require('fs');
const multer = require("multer");
const multipart  =  require('connect-multiparty');
const session = require('express-session');
const querystring = require('node:querystring');
const config = require("./config/auth.config");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const dotenv = require('dotenv');
dotenv.config();

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
}));

const mongoose  = require('./db/mongoose');
const bodyParser = require('body-parser');

// Load in the mongoose models
const { List } = require('./db/models/list.model');
const { Task } = require('./db/models/task.model');
const { User } = require('./db/models/user.model');
const { Tag } = require('./db/models/tag.model');
const { authJwt } = require('./middleware');
const e = require('express');
const { WorkingDates } = require('./db/models/workingDates.model');

// Load middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Route handlers */
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, "./uploads")
    },
    //TODO change file extension
    filename: (req, file, cb) => {
        const userId = authJwt.getUserId(req);
        const fileSize = parseInt(req.headers["content-length"]);
        if (fileSize < 10000000)  {
            cb(null, `${userId}-profilepicture.jpg`);
        } else {
            //TODO add size limitation
        }
    }
});

// Make the uploads folder accesible to retrieve the profile pic on frontend
app.use('/api/images', express.static('uploads'));

const fileData = multer({ storage: storage });
var uploadSingle = fileData.single("uploads");

const passport = require('passport');
const { googleSignIn } = require('./controllers/auth.controller');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

var jwt = require("jsonwebtoken");

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async(accessToken, refreshToken, profile, done) => {
    const newUser = {
        googleId: profile.id,
        username: profile.displayName.replace(/\s/g, "")
    }
    try {
        let user = await User.findOne({ googleId: profile.id})
        if (user) {
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            done(null, user);
        } else {
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            user = await User.create(newUser); 
            done(null, user);
        }
    } catch(err) {
        console.log(err);
    }
  }
));
 
app.get('/api/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    User.findOne({
        username: req.user.username
      }).exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
         
          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });

          const query = querystring.stringify({
            "username": user.username,
            "accessToken": token,
        });
    
        res.redirect('http://localhost:4200/dashboard/?' + query);
    });
});


app.post('/api/upload', (req, res) => {
    uploadSingle(req, res, function (err) {
        if (err) {
            console.log(err);
            return;
        } else if (res.status(200)) {
            res.json({ message: "Successfully uploaded files" });
            res.end();
        }
    });
});


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
app.get('/lists/:id/tasks', async (req, res) => {
    let id = req.params.id;

    await Task.find({
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
        res.send(taskDoc);
    })    
})


/** 
 * POST /lists/:id/cloneTask
 * Purpose: Clones a task from specified list
 */
app.post('/lists/:id/cloneTask', async (req, res) => {
    //  We want to create a new task in the specified list
    let lastTask = await Task.findOne().sort({"order": -1});
    let clonedTask =  await Task.findById(req.body.taskId);

    let task = new Task({
        title: clonedTask.title,
        _listId:  req.body.listId,
        status: clonedTask.status,
        description: clonedTask.description,
        dateCreated: req.body.dateCreated,
        estimation: clonedTask.estimation,
        tags: clonedTask.tags,
        order: lastTask != null ? lastTask.order + 1 : 0,
    })
    await task.save().then((taskDoc) => {
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
 * PATCH /lists/:id/tasks/:id
 * Purpose: Modifies an existing task
 */
app.patch('/lists/:listId/tasks/:taskId', async (req, res) => {
    let sortedTags = req.body.tags;

    if (sortedTags) {
        sortedTags.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    await Task.findByIdAndUpdate(
    req.params.taskId, {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        observations: req.body.observations,
        estimation: req.body.estimation,
        tags: sortedTags,
        isStarted: req.body.isStarted
    })
        
    res.status(200).send(req.body);
        
});

/** 
 * PATCH /lists/:id/tasks
 * Purpose: Modifies an existing task
 */
 app.patch('/lists/:listId/tasks/:taskId/startPause', async (req, res) => {
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
});

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
 * DELETE /tags/:id
 * Purpose: Delete all tags defined for an user
 */
app.delete('/removetags', async (req, res) => {
    let userId = authJwt.getUserId(req);
    await Tag.deleteMany({userId: userId});
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

/** 
 * GET /export
 * Purpose: Get data for export
 */
app.get('/export',  async (req, res) => {
    let userId = authJwt.getUserId(req);
    let tags = await Tag.find({userId: userId});
    let lists = await List.find({userId: userId});
    let tasks = [];

    lists.sort((a,b) => (a.status < b.status) ? 1 : ((b.status < a.status) ? -1 : 0));
    
    for (let i = 0; i < lists.length; i++) {
        var obj = {
            tasks: await Task.find({_listId: lists[i]._id}),
            id: lists[i]._id
        }
        tasks.push(obj);
    }

    var response = {
        tags: tags,
        tasks: tasks,
        lists: lists
    };
    res.send(response);    
})

function compare( a, b ) {
    if ( a.status < b.status ){
      return -1;
    }
    if ( a.status > b.status ){
      return 1;
    }
    return 0;
}

/** 
 * POST /
 * Purpose: Imports data in current user's account
 */
app.post('/import', async (req, res) => {
    let userId = authJwt.getUserId(req);

    let lists = req.body["lists"];
    let taskLists = req.body["tasks"];
    let tags = req.body["tags"];

    let currentLists = await List.find({userId: userId});
    let currentTags = await Tag.find({userId: userId}); 
    let skipElement = false;

    for (let k = 0; k < lists.length; k++) {
        skipElement = false;
        for (let l = 0; l < currentLists.length; l++) {
            if (lists[k].title == currentLists[l].title) {
                lists[k]._id = null;
                skipElement = true;
            }
        }

        if (skipElement) {
            continue;   
        }

        let newList = await new List({
            title: lists[k].title,
            description: lists[k].description,
            dateCreated: lists[k].dateCreated,
            dateCompleted: lists[k].dateCompleted,
            observations: lists[k].observations,
            userId: userId,
            status: lists[k].status
        });
        newList.save();

        for (let i = 0; i < taskLists.length; i++) {
            if (taskLists[i].id == lists[k]._id) {
                for (let j = 0; j < taskLists[i].tasks.length; j++) {
                    let newTask = await new Task({
                        title: taskLists[i].tasks[j].title,
                        description: taskLists[i].tasks[j].description,
                        dateStarted: taskLists[i].tasks[j].dateStarted,
                        dateCreated: taskLists[i].tasks[j].dateCreated,
                        dateCompleted: taskLists[i].tasks[j].dateCompleted,
                        observations: taskLists[i].tasks[j].observations,
                        estimation: taskLists[i].tasks[j].estimation,
                        _listId: newList._id,
                        status: taskLists[i].tasks[j].status,
                        order: taskLists[i].tasks[j].order,
                        isStarted: taskLists[i].tasks[j].isStarted,
                        tags: taskLists[i].tasks[j].tags
                    });
                    newTask.save();
                }
            }
        }
    }
    
    for (let i = 0; i < tags.length; i++) {
        skipElement = false;
        for (let j = 0; j < currentTags.length; j++) {
            if (tags[i].title == currentTags[j].title) {
                skipElement = true;
            }
        }

        if (skipElement) {
            continue;   
        }

        let newTag = await new Tag({
            title: tags[i].title,
            color: tags[i].color,
            userId: userId,
        });
        newTag.save();
    }
    res.status(200).send({});
})

/** 
 * GET /
 * Purpose: Checks if a file with the given name exists
 */
app.get('/checkFile/:file', async (req, res) => {
    const path = 'uploads/' + req.params.file;
    await fs.access(path, fs.F_OK, (err) => {
        if (err) {
            res.status(200).send(false);
            return;
        }
        res.status(200).send(true);
    })
})

app.listen(3000, () => {
    console.log("App listening on port 3000");
})

