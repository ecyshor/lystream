/**
 * Created by nreut on 26-Jun-14.
 */
var User = require('../models/account'),
    passport = require('passport');
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;