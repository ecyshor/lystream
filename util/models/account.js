/**
 * Created by nreut on 26-Jun-14.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    streamModel = require('./stream');

var Account = new Schema({
    nickname: String
});

Account.plugin(passportLocalMongoose);

Account.post('remove', function (doc) {
    console.log('Removing user with id ' + doc._id + ' and user streams.');
    streamModel.remove({user_id: doc._id});
});

module.exports = mongoose.model('Account', Account);