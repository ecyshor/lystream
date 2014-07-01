/**
 * Created by nreut on 26-Jun-14.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + 'database' + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + 'local database');
    }
});

module.exports = mongoose;