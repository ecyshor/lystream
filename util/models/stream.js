/**
 * Created by nreut on 26-Jun-14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Stream = new Schema({
    name: {
        type: String,
        match: /^[a-zA-z0-9]{5,50} /
    },
    description: String,
    user_id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Stream', Stream);