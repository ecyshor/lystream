/**
 * Created by Nicu on 07/10/2014.
 */
var  path = require('path')
    , userRoles = require('../public/javascripts/angular/routingConfig').userRoles
    , log = require('debug')('lystream:routes');
module.exports = function (app) {

    app.use('/home', require('./index'));
    app.use('/stream', require('./receive_stream_ffmpeg'));
    app.use('/auth', require('./authentication'));
    app.route('/partials/*')
        .get(function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        });
    app.route('/*')
        .get(function (req, res) {
            log('Rendering index for user ' + JSON.stringify(req.user));
            var role = userRoles.anon, username = '';
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
