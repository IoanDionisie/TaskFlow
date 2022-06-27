const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        minlength: 1,
        trim: true
    }
})

const List = mongoose.model('list', ListSchema);

module.exports = { List }