/**
 * Created by nreut on 30-Jun-14.
 */
var express = require('express');
var router = express.Router();

router.get('/login', function (req, res) {
    res.render('partials/auth/login');
});
module.exports = router;

