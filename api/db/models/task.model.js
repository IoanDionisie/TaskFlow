
const mongoose = require('mongoose');
const { isStringLiteral } = require('typescript');

const TagSchema = new mongoose.Schema({
    title: {
        type: String, 
        minlength: 1,
        trim: true
    },
    color: {
        type: String
    }
});

const WorkingDatesSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    type: {
        type: String
    }
})

const TaskSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        minlength: 1,
        trim: true
    },
    _listId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    order: {
        type: Number
    },
    dateCreated: {
        type: Date
    },
    observations: {
        type: String
    },
    deadline: {
        type: Date
    },
    isStarted: {
        type: String,
        default: "notStarted"
    },
    dateStarted: {
        type: Date
    },
    dateCompleted: {
        type: Date
    },
    tags: [
        TagSchema
    ],
    workIntervals: [
        WorkingDatesSchema
    ],
    workedTime: {
        type: Number
    },
    totalWorkingTime: {
        type: String,
        default: "Not set"
    }
})

const Task = mongoose.model('task', TaskSchema);

module.exports = { Task }