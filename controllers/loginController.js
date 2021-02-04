// ##################################################
// ######### Author : Vimal Makwana   ###############
// ##################################################
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const bcrypt = require("bcrypt");
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

// router.get('/', (req, res) => {
//     res.render("employee/login");
// });
// Login Page   

router.get('/', forwardAuthenticated, (req, res) => res.render('employee/login',{ message: req.flash('error') }));


// asysnc function
// router.post('/', async (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const EmpData = await Employee.findOne({ email: email });
//     //console.log(EmpData);
//     const match = await bcrypt.compare(password, EmpData.password);
//     //console.log(match);
//     if (match) {
//         res.redirect("/employee/list");
//     } else {
//         res.render("employee/login");   
//     }
// });

// Login
router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/employee/list',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

function checkLogin(req, res)
{
    const email = req.body.email;
    const password = req.body.password;
    console.log({ email });
    const useremail = Employee.findOne({ email: email });
   // res.send({useremail});
    console.log({ useremail });
    if (Employee.email === email) {
        console.log('Matched');
    } else {
        console.log('Not Matched');
    }
}


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                //console.log("In this case");
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});

module.exports = router;