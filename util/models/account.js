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
    },
    streams: [
        { type: Schema.Types.ObjectId, ref: 'Stream' }
    ]
});

Account.plugin(passportLocalMongoose, {
    usernameField: 'email',
   // selectFields:'email role username' Working, decide whether to use
    usernameLowerCase : true,
    populateFields: 'streams'
});

Account.pre('remove', function (doc) {
    debug('Removing user with id ' + doc._id + ' and user streams.');
    streamModel.remove({_creator: doc._id});
});

module.exports = mongoose.model('Account', Account);