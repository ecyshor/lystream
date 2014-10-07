/**
 * Created by nreut on 30-Jun-14.
 */
var express = require('express');
var router = express.Router();
var Account = require('../util/models/account');
var passport = require('passport');
var debug = require('debug')('lystream:authentication');

router.post('/login', passport.authenticate('local'), function (req, res) {
    //TODO send the user with the response
    debug('Logged in user with details: %s', JSON.stringify(req.user));
    res.send(200, {
        'email': req.user.email,
        'username': req.user.username,
        'role': req.user.role
    });
    res.end();
});


router.post('/register', function (req, res) {
    debug('Registering account with info: ' + JSON.stringify(req.body));
    Account.register(
        new Account({
            username: req.body.username,
            email: req.body.email,
            role: req.body.role
        }),
        req.body.password,
        function (err, account) {
            /*try {
             User.validate(req.body);
             }
             catch (err) {
             debug('User validation error ' + err );
             res.send(400, err.message);
             }*/
            debug('Register outcome: \n Error: ' + JSON.stringify(err) + '\nAccount: ' + JSON.stringify(account));
            if (err) {
                debug('Error: user already exists in database.');
                res.send(400, "User already exists");
            }
            passport.authenticate('local')(req, res, function () {
                res.json(200, {
                    'email': account.email,
                    'username': account.username,
                    'role': account.role
                });
                res.end();
            });
        });
});

router.post('/logout', function (req, res) {
    req.logout();
    res.send(200);
});
module.exports = router;

