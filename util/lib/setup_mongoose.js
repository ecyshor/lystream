/**
 * Created by nreut on 26-Jun-14.
 */
var mongoose = require('mongoose');
var debug = require('debug')('lystream:database');
mongoose.connect('mongodb://localhost/test', function (err, res) {
    if (err) {
        debug('ERROR connecting to: ' + 'database' + '. ' + err);
    } else {
        debug('Succeeded connected to: ' + 'local database');
    }
});

module.exports = mongoose;