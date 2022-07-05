
const mongoose = require('mongoose');

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
    }
})

const Task = mongoose.model('task', TaskSchema);

module.exports = { Task }