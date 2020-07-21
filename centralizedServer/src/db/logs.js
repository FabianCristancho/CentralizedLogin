const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
     date: Date,
     server: String,
     timeResponse: Number,
     status: Boolean
});

module.exports = mongoose.model('testLogs', LogSchema);