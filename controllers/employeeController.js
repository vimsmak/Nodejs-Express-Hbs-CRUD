// ##################################################
// ######### Author : Vimal Makwana   ###############
// ##################################################
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const bcrypt = require("bcrypt");
const flash = require('connect-flash');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//router.get('/', ensureAuthenticated,(req, res) => {
router.get('/',(req, res) => {    
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee"
    });
});

//router.post('/', ensureAuthenticated, (req, res) => {
router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


async function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.password = req.body.password;
    employee.confirm_password = req.body.confirm_password;
    
    // if (req.body.password.length !== 0) {
    //     employee.password = bcrypt.hashSync(req.body.password, 10); //Bcryot Hash password.    
    // }
    // this.confirm_password = undefined;
    
    await employee.save((err, doc) => {
        if (!err)
        {
            req.flash('success_msg', 'You are now registered!');
            res.redirect('employee/list');
        }            
        else {
            if (err.name == 'ValidationError') {
                //console.log('error name : validation insertion');
                handleValidationError(err, req.body);
               // console.log(err);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id },  
    req.body, {runValidators: true}, function (err, docs) { 
    if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
               // console.log('error name : validation update!');
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
    // Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
    //     if (!err) { res.redirect('employee/list'); }
    //     else {
    //         if (err.name == 'ValidationError') {
    //             console.log('error name : validation insertion');
    //             handleValidationError(err, req.body);
    //             res.render("employee/addOrEdit", {
    //                 viewTitle: 'Update Employee',
    //                 employee: req.body
    //             });
    //         }
    //         else
    //             console.log('Error during record update : ' + err);
    //     }
    // });
}


router.get('/list', ensureAuthenticated, (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

// router.get('/login', (req, res) => {
//     Employee.find((err, docs) => {
//         if (!err) {
//             res.render("employee/login", {
//                 list: docs
//             });
//         }
//         else {
//             console.log('Error in retrieving employee list :' + err);
//         }
//     });
// });


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
            case 'password':
                body['passwordError'] = err.errors[field].message;
                //console.log('password');
                break;
            case 'confirm_password':
                body['confirm_passwordError'] = err.errors[field].message;
                break;
            case 'mobile':
                body['mobileError'] = err.errors[field].message;
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

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;