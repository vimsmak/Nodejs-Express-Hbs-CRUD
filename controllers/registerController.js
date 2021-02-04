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

router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Register Employee"
    });
});

module.exports = router;