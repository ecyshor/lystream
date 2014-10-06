var express = require('express')
    , path = require('path')
    , favicon = require('static-favicon')
    , morgan = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('./util/lib/setup_passport')
    , csrf = require('csurf')
    , methodOverride = require('method-override')
    , log = require('debug')('lystream:server');

var app = module.exports = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true}));

var env = process.env.NODE_ENV || 'development';
if ('development' === env || 'production' === env) {
    app.use(csrf());
    app.use(function (req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
}

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
//Routes

app.use('/home', require('./routes/index'));
app.use('/stream', require('./routes/receive_stream_ffmpeg'));
app.use('/auth', require('./routes/authentication'));
app.route('/partials/*')
    .get(function (req, res) {
        var requestedView = path.join('./', req.url);
        res.render(requestedView);
    });
app.route('/*')
    .get(function (req, res) {
        log('Rendering index');
        res.render('index');
    });

///// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status);
        log('Error : ' + err.message + '\n' + err);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log('Error ' + err.message);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
