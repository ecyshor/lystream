/**
 * Created by nreut on 26-Jun-14.
 */
var log = require('debug')('lystream:streamModel'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
var Stream = new Schema({
    name: String,
    description: String,
    uploadSecretPassKey: String,
    _creator: { type: String, ref: 'Account' }
});

Stream.pre('save', function (next) {
    this.uploadSecretPassKey = crypto.randomBytes(20).toString('hex');
    log('Generated secret key for stream ' + this._id + ' : ' + this.uploadSecretPassKey);
    next();
});
Stream.post('save', function (doc) {
    log('Saved document: ' + JSON.stringify(doc));
});
module.exports = mongoose.model('Stream', Stream);