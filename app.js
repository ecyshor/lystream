var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./util/lib/setup_passport');

var routes = require('./routes/index');
var streamingRoutes = require('./routes/receive_stream_ffmpeg');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/:index(home)?', routes);
app.use('/stream', streamingRoutes);
///// catch 404 and forward to error handler
/*app.use(function (req, res, next) {
 var err = new Error('Not Found');
    err.status = 404;
    next(err);
 });*/

/// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log('Error 500: ' + err.message + '\n' + err);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
//}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
