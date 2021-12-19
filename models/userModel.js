const mongoose = require("mongoose");
const bcryptJs = require("bcryptjs");
const userSchema = mongoose.Schema;
const userKey = new userSchema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    userName: {
        type: String
    },
    countryCode: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    dateOfBirth: {
        type:String
    },
    otp: {
        type: String
    },
    otpTime: {
        type: String
    },
    otpVerify: {
        type: Boolean,
        default: false
    },
    emailVerify: {
        type: Boolean,
        default: false
    },

    
    userType: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DELETE", "BLOCK"],
        default: "ACTIVE"
    }
}, {timestamps: true});
const userModel = mongoose.model("user", userKey);
module.exports = userModel;
userModel.findOne({userType: "ADMIN"}, (findError, findResult)=>{
    if(findError){
        console.log("Internal server error");
    } else if(findResult){
        console.log("ADMIN is already exist....");
    } else{
        let obj = {
            firstName: "Manish",
            lastName: "Upadhyay",
            phoneNumber: "9631250801",
            email: "no-manish@mobiloitte.com",
            countryCode: "+91",
            userName: "Manish4200",
            password: bcryptJs.hashSync("1234"),
            address: "Siwan",
            dateOfBirth: "01/01/2021",
            userType: "ADMIN",
            otpVerify: "true",
            emailVerify: "true",
            permission: {
                userManagement: true
            },
            status: "ACTIVE"
        }
        userModel(obj).save((saveError, saveResult)=>{
            if(saveError){
                console.log("Internal server error: Admin is not created yet....");
            } else{
                console.log("Admin has been created successfully...."+ saveResult);
            }
        });
    }
});