const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        minlength: 1,
        trim: true
    },
    userId: {
        type: String
    },
    observations: {
        type: String
    },
    dateCreated: {
        type: Date
    },
    dateCompleted: {
        type: Date
    }
})

const List = mongoose.model('list', ListSchema);

module.exports = { List }