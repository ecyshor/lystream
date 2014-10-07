/**
 * Created by nreut on 26-Jun-14.
 */
var mongoose = require('../lib/setup_mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    streamModel = require('./stream'),
    debug = require('debug')('lystream:modeL:user');

var Account = new Schema({
    username: String,
    role: {
        bitMask: String,
        title: String
    }
});

Account.plugin(passportLocalMongoose, {
    usernameField: 'email'
    // selectFields:'email,role,username'(Not working yet)
    //TODO select only necessary fields from database, not entire entity
});

Account.post('remove', function (doc) {
    debug('Removing user with id ' + doc._id + ' and user streams.');
    streamModel.remove({user_id: doc._id});
});

module.exports = mongoose.model('Account', Account);