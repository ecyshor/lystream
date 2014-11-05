var express = require('express')
    , path = require('path')
    , favicon = require('static-favicon')
    , morgan = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , MongoStore = require('connect-mongo')(session)
    , passport = require('passport')
    , csrf = require('csurf')
    , methodOverride = require('method-override')
    , log = require('debug')('lystream:server')
    , User = require('./util/models/account');

var app = module.exports = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        url: 'mongodb://localhost/test'
    }, function (err) {
        if (err)
            log(err + 'Error connecting to session database');
        log('connect-mongodb setup ok');
    })
}));
app.use(express.static(path.join(__dirname, 'public')));
var env = process.env.NODE_ENV || 'development';
app.set('env',env);
if ('development' === env || 'production' === env) {
    app.use(csrf());
    app.use(function (req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
}
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Routes

require('./routes/routes')(app);

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
        log('Error : ' + err.message + '\n' + err.stack);
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
