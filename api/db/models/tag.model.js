
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
    },
    userId: {
        type: String
    }
})

const Tag = mongoose.model('tag', TagSchema);

module.exports = {Tag}