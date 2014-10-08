/**
 * Created by Nicu on 07/10/2014.
 */
var path = require('path')
    , userRoles = require('../public/javascripts/angular/routingConfig').userRoles
    , accessLevels = require('../public/javascripts/angular/routingConfig').accessLevels
    , log = require('debug')('lystream:routes')
    , _ = require('underscore')
    , router = require('express').Router();

var routes = [
    {
        path: '/streams',
        accessLevel: accessLevels.user
    }
]
router.use(ensureAuthorized);
router.use('/home',  require('./index'));
router.use('/auth', require('./authentication'));
router.use('/stream', require('./receive_stream_ffmpeg'));
router.use('/streams', require('./streams'));
module.exports = function (app) {
    app.use(router);
    app.route('/partials/*')
        .get(function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        });
    app.route('/*')
        .get(function (req, res) {
            log('Rendering index for user ' + JSON.stringify(req.user));
            var role = userRoles.public, username = '';
            if (req.user) {
                role = req.user.role;
                username = req.user.username;
            }
            res.cookie('user', JSON.stringify({
                'username': username,
                'role': role
            }));
            res.render('index');
        });
};
function ensureAuthorized(req, res, next) {
    log('Checking access for request path ' + req.originalUrl.match(/\W{0,1}\w*/)[0]);
    var role;
    if (!req.user)
        role = userRoles.public;
    else
        role = req.user.role;
    var accessLevel
    try {
        accessLevel = _.findWhere(routes, { path: req.originalUrl.match(/\W{0,1}\w+/)[0] }).accessLevel;
    } catch (err) {
        accessLevel = accessLevels.public;
    }
    if (!(accessLevel.bitMask & role.bitMask))
        return res.send(403);
    return next();
}