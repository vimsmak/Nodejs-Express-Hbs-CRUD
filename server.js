// ##################################################
// ######### Author : Vimal Makwana   ###############
// ######### Date   : 1 Jan 2021      ###############
// ##################################################
require('./models/db');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars'); //Added
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access'); //Added
const bodyparser = require('body-parser');

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

// Passport Config
require('./config/passport')(passport);

const loginController = require('./controllers/loginController');
const employeeController = require('./controllers/employeeController');
const registerController = require('./controllers/registerController');


// const securePass = async (password) => {
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(password);
// }
// securePass("test123@");

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();  
});

app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));

app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', handlebars: allowInsecurePrototypeAccess(Handlebars), layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

//Showing login form 
// app.get("/login", function (req, res) { 
//     res.render("employee/login"); 
// });
app.use('/employee', employeeController);
app.use('/login', loginController);
app.use('/register', registerController);