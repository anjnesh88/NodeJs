const mongoose = require("mongoose");
var validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
        index: true
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 50
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password: " + value);
            }
        }
    },
    age: {
        type: String,
        min: 18
    },
    gender: {
        type: String,
        // enum: {
        //     values: ["male", "female", "others"],
        //     message: `{VALUE} is not a valid gender type`
        // }
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL: " + value);
            }
        }
    },
    about: {
        type: String,
        trim: true,
        default: "This is a default about the user!"
    },
    skills: {
        type: [String]
    }
},{ timestamps: true });

userSchema.index({firstName: 1, lastName: 1})

userSchema.methods.getJWT = async function(){
    const user = this;
    const token  = await jwt.sign({_id: user._id}, "Vasu@123",{ expiresIn: '1d'});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByuser){
    const user = this;
    const passwordHash = user.password
    const isPasswordValid = bcrypt.compare(passwordInputByuser, passwordHash);
    return isPasswordValid;
}
const User = mongoose.model("User", userSchema);
module.exports = {User};