var express = require('express');
var router = express.Router();
var debug = require('debug')('lystream:router:index');

/* GET home page content. */
router.get('/', function (req, res) {
    debug('Returning result for home page.');
    res.end();
});

module.exports = router;

