const express = require('express');
const cors = require("cors");
const app = express();
const fs = require('fs');
const multer = require("multer");
const multipart  =  require('connect-multiparty');
const session = require('express-session');
const querystring = require('qs');
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
const appPage = process.env.SITEPAGE;

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

// Load middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Route handlers */
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/list.routes')(app);
require('./routes/task.routes')(app);
require('./routes/tag.routes')(app);
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
const passport = require('passport');

var uploadSingle = fileData.single("uploads");

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
    
        res.redirect(`${appPage}/dashboard/?` + query);
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