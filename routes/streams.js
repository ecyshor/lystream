/**
 * Created by Nicu on 08/10/2014.
 */
var router = require('express').Router(),
    Stream = require('../util/models/stream'),
    Account = require('../util/models/account'),
    log = require('debug')('lystream:streamApi');

/*Return the user's streams*/
router.get('/', function (req, res) {
    Account
        .findOne({ _id: req.user._id })
        .populate('streams')
        .exec(function (err, account) {
            if (err) {
                log('Error retrieving user streams ' + err);
                res.json(500, err);
            }
            log('Retrieved user streams ');
            res.json(200, account.streams);
            res.end();
        });
});
/*Create a new stream for the user*/
router.post('/', function (req, res) {
    log('Creating stream with information ' + JSON.stringify(req.body.stream) + ' for user ' + req.user);
    Stream.create({
        name: req.body.stream.name,
        description: req.body.stream.description,
        _creator: req.user._id
    }, function (err, streamDoc) {
        if (err) {
            log('Error in creating document ' + err);
            res.json(400, err);
            res.end();
        }
        log('Created document ' + streamDoc);
        req.user.streams.push(streamDoc);
        req.user.save(function (err, user, numberAffected) {
            if (err) {
                log('Error saving stream in the user field.');
            }
        });
        res.json(201, streamDoc);
        res.end();
    });
});

router.get('/:{streamId}', function (req, res) {

});
router.post('/:{streamId}', function (req, res) {

});
router.delete('/:{streamId}', function (req, res) {

});
module.exports = router;