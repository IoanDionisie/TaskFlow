const mongoose = require('mongoose');

const HistoryItemSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    action: {
        type: String
    }
});


const HistoryItem = mongoose.model('historyItem', HistoryItemSchema);

module.exports = { HistoryItem }