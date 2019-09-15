var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

mongoose.connect('mongodb://localhost:27017/kart', {
   useNewUrlParser: true
});

require('./config/passport');
dotenv.config();
// view engine setup
app.engine('hbs', expressHbs({
   defaultLayout: 'layout',
   extname: 'hbs',
   helpers: {
            section: function(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
   extended: false
}));
app.use(cookieParser());
app.use(session({
   secret: 'nayanverma',
   resave: false,
   saveUninitialized: false,
   store: new MongoStore({
      mongooseConnection: mongoose.connection
   }),
   cookie: {
      maxAge: 180 * 60 * 1000
   }, // { min * sec * milSec}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
   res.locals.loginStatus = req.isAuthenticated();
   res.locals.session = req.session;
   next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

module.exports = app;
