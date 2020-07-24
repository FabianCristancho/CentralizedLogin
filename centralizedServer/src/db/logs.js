const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
     date: Date,
     server: String,
     timeResponse: Number,
     code: Number,
     level: String
});

module.exports = mongoose.model('logs', LogSchema);