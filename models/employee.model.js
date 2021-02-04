// ##################################################
// ######### Author : Vimal Makwana   ###############
// ##################################################
const mongoose = require('mongoose');
//const bcrypt = require("bcrypt");

var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Full name is required.'
    },
    email: {
        type: String,
        required: 'Email address is required.',
        unique:true
    },
    mobile: {
        type: String,
        required: 'Mobile Number is required.',
        unique:true
    },
    city: {
        type: String
    },
    password: {
        type: String,
        required: 'Password is required.'
    }
});

// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Bcryt password hash algoritham...
// employeeSchema.pre("save", async function (next) {
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// })

mongoose.model('Employee', employeeSchema);