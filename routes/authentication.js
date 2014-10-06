/**
 * Created by nreut on 30-Jun-14.
 */
var express = require('express');
var router = express.Router();
var Account = require('../util/models/account');
var passport = require('../util/lib/setup_passport');
var debug = require('debug')('lystream:authentication');

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
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
            try {
                User.validate(req.body);
            }
            catch (err) {
                return res.send(400, err.message);
            }
            debug('Register outcome: \n Error: ' + JSON.stringify(err) + '\nAccount: ' + JSON.stringify(account));
            if (err === 'UserAlreadyExists') {
                debug('Error: user already exists in database with email %s', account.email);
                return res.send(403, "User already exists");
            }
            else if (err) {
                debug('Error registering new user from request: ' + req + ' with error message: ' + err);
                res.send(500);
            }
            res.redirect('/');
        });
    res.end();
});
module.exports = router;

