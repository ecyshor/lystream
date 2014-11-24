/**
 * Created by Nicu on 07/10/2014.
 */
var path = require('path')
    , userRoles = require('../public/javascripts/angular/routingConfig').userRoles
    , accessLevels = require('../public/javascripts/angular/routingConfig').accessLevels
    , log = require('debug')('lystream:routes')
    , _ = require('underscore')
    , router = require('express').Router();
/**
 * Route acces definition, if not present then public access is granted
 * */
var routes = [
    {
        path: /^\/?streams\/?$/i,
        accessLevel: accessLevels.user,
        requestMethod: 'POST,GET'
    }
];
/*
 * Rest routes
 * */
router.use(ensureAuthorized);
router.use('/home', require('./index'));
router.use('/auth', require('./authentication'));
router.use('/streams', require('./streams'));
module.exports = function (app) {
    app.use(router);
    /*
     * Provide partials for the client
     * */
    app.route('/partials/*')
        .get(function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        });
    /*
     * For every route that is not caught by the router, the index is rendered
     * */
    app.route('/*')
        .get(function (req, res) {
            log('Rendering index for user ' + req.user);
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

/*
 * Check for user privilege for every route request, if it has the correct role
 * */
function ensureAuthorized(req, res, next) {
    log('Checking access for request path ' + req.originalUrl + ' for user ' + req.user);
    var role;
    if (!req.user)
        role = userRoles.public;
    else
        role = req.user.role;
    var accessLevel;
    try {
        log('Finding route access level for route with original url ' + req.originalUrl);
        var route = _.find(routes, function (route) {
                var routePath = route.path.test(req.originalUrl);
                var requestMethod = route.requestMethod.indexOf(req.method.toUpperCase()) > -1;
                return routePath && requestMethod;
            }
        );
        accessLevel = route.accessLevel;
        log('Found access level  ' + accessLevel + ' for route, checking user role.');
    } catch (err) {
        log('Error in getting access level for route, access level set to default public due to error: ' + err);
        accessLevel = accessLevels.public;
    }
    if (!(accessLevel.bitMask & role.bitMask))
        return res.send(403);
    return next();
}