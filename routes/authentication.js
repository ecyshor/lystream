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
            email: req.body.email}),
        req.body.password,
        function (err, account) {
            debug('Register outcome: \n Error: ' + JSON.stringify(err) + '\nAccount: ' + JSON.stringify(account));
            if (err) {
                debug('Error registering new user from request: ' + req + ' with error message: ' + err);
                return res.render('register', { account: account });
            }
            res.redirect('/');
        });
    res.end();
});
module.exports = router;

