
const mongoose = require('mongoose');
const { isStringLiteral } = require('typescript');

const WorkingDatesSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    type: {
        type: String
    }
})

const WorkingDates = mongoose.model('workingDates', WorkingDatesSchema);

module.exports = {WorkingDates}