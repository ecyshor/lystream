/**
 * Created by nreut on 30-Jun-14.
 */
var express = require('express');
var router = express.Router();
var Account = require('../util/models/account');
var passport = require('../util/lib/setup_passport');

router.get('/login', function (req, res) {
    res.render('partials/auth/login');
});
router.get('/register', function (req, res) {
    res.render('partials/auth/register');
});
router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});

router.post('/register', function (req, res) {
    console.log('Registering account with infos: ' + JSON.stringify(req.body));
    Account.register(
        new Account({
            username: req.body.username,
            email: req.body.email}),
        req.body.password,
        function (err, account) {
            console.log('Register outcome: \n Error: ' + JSON.stringify(err) + '\nAccount: ' + JSON.stringify(account));
            if (err) {
                console.log('Error registering new user from request: ' + req + ' with error message: ' + err);
                return res.render('register', { account: account });
            }
            res.redirect('/');
        });
    res.end();
});
module.exports = router;

