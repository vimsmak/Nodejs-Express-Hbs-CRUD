// ##################################################
// ######### Author : Vimal Makwana   ###############
// ##################################################
const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require("bcrypt");

var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Full name is required.',
        validate: [validator.isAlpha, 'Full name may only have letters.']
    },
    email: {
        type: String,
        required: 'Email address is required.',
        lowercase: true,
        minlength: [10, "Email Can't be shorter than 10 characters"],
        //unique: [true, 'That email address is taken.'],
        validate: [validator.isEmail, 'Enter a valid email address.']
    },
    mobile: {
        type: String,
        required: 'Mobile Number is required.',
        validate: [validator.isMobilePhone, 'Please enter valid mobile numner.'],
        unique:true
    },
    city: {
        type: String
    },
    password: {
        type: String,
        required: 'Password is required.'
    },
    confirm_password: {
        type: String,
        required: [true, 'Retype your password.'],
        validate: {
            validator: function (el) {
                return el === this.password;
            }, message: 'Passwords don\'t match.'
        }
    }
});

// Custom validation for email
// employeeSchema.path('email').validate((val) => {
//     emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return emailRegex.test(val);
// }, 'Invalid e-mail.');

//check email is already exists or not.
employeeSchema.path('email').validate(async(email) => {
    const emailCount = await mongoose.models.Employee.countDocuments({ email })
    return !emailCount;
}, 'Email already exists.');

//schema middleware to apply before saving
employeeSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = undefined;
      next();
});

mongoose.model('Employee', employeeSchema);
