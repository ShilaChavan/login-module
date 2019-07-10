var express =  require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser =require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var app = express();
var port = process.env.PORT||8080;
var flash = require('connect-flash');

require('./config/database');
require('./config/passport');

app.use(morgan('dev'));
app.use('cookieParser');
app.use(bodyParser.urlencoded({extended: true
}));
app.set('view engine',ejs);
app.use(session({
    secreat: 'justasecreat',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/route.js')(app,passport);

app.listen(port);
console.log("Port:"+port);

