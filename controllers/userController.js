const userModel = require("../models/userModel");
const commonFunction = require("../helper/commonFunction");
const bcryptjs = require("bcryptjs");
const { ReturnDocument } = require("mongodb");
const jwt=require("jsonwebtoken")

module.exports = {

    /*User SignUp Api's */

    userSignUp: async (req, res) => {
        try {
            let query = {
                $and: [{ $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }] }, { status: { $ne: "DELETE" } }]
            }
            let findResult = await userModel.findOne(query);
            if (findResult) {
                console.log(req.body);
                if (findResult.phoneNumber == req.body.phoneNumber) {
                    return res.send({ responseCode: 409, responseMessage: "Phone Number is already exist...." });
                } else if (findResult.email == req.body.email) {
                    return res.send({ responseCode: 409, responseMessage: "Email is already exist...." });
                }
            } else if (!findResult) {
                req.body.otp = commonFunction.getOtp();
                req.body.userName = req.body.firstName + req.body.phoneNumber.slice(-3);
                req.body.password = bcryptjs.hashSync(req.body.password);
                req.body.otpTime = new Date().getTime();
                let saveResult = await new userModel(req.body).save();
                if (saveResult) {
                    let subject = "verify your otp and email link";
                    let text = `Dear ${req.body.firstName + " " + req.body.lastName}, Please verify your otp: ${req.body.otp} and also verify your email link http://localhost:4200/user/userEmailVerification/${saveResult._id},\notp and email link will expires in 3 minutes`;
                    let sendMailResult = await commonFunction.sendMail(req.body.email, subject, text);
                    if (sendMailResult) {
                        return res.send({ responseCode: 200, responseMessage: "SignUp successfully....", responseResult: saveResult });
                    }
                }
            }
        } catch (error) {
            console.log(error);
            res.send({ responseCode: 500, responseMessage: "server error" });
        }
    },
    userOtpVerify: async (req, res) => {
        try {
            let query = {
                $and: [{ $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }] }, { userType: "USER" }, { status: { $in: "ACTIVE" } }]
            }
            let findResult = await userModel.findOne(query);
            if (!findResult) {
                return res.send({ responseCode: 404, responseMessage: "user does't exist" });
            } else if (findResult) {
                if (findResult.otpVerify != true) {
                    let otpTimeDifference = (new Date().getTime()) - findResult.otpTime;
                    if (otpTimeDifference <= (3 * 60 * 1000)) {
                        if (findResult.otp == req.body.otp) {
                            let updateResult = await userModel.findByIdAndUpdate({ _id: findResult._id }, { $set: { otpVerify: true } }, { new: true });
                            if (updateResult) {
                                return res.send({ responseCode: 202, responseMessage: "otp verify successfully....", responseResult: updateResult });
                            }
                        } else {
                            return res.send({ responseCode: 404, responseMessage: "Invalid Otp" });
                        }
                    } else {
                        return res.send({ responseCode: 403, responseMessage: "otp time has been expired: Please resend otp and try again...." });
                    }
                } else {
                    return res.send({ responseCode: 409, responseMessage: "otp already verified...." });
                }
            }
        } catch (error) {
            return res.send({ responseCode: 500, responseMessage: "server error", responseResult: error.message });
        }
    },
    userEmailVerification: async (req, res) => {
        try {
            let query = {
                $and: [{ _id: req.params._id }, { userType: "USER" }, { status: "ACTIVE" }]
            }
            var findResult = await userModel.findOne(query)
            if (findResult) {
                if (findResult.emailVerify != true) {
                    var updateResult = await userModel.findByIdAndUpdate({ _id: findResult._id }, { $set: { emailVerify: true } }, { new: true })
                    if (updateResult) {
                        return res.send({ responseCode: 200, responseMessage: "USER Email Varify SuccessFully", responseResult: updateResult });
                    }

                }
            }

        } catch (error) {
            return res.send({ responseCode: 500, responseMessage: "server error" });
        }


    },
    userForgotPassword: async (req, res) => {
        try {
            let query = {
                $and: [{ $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }] }, { userType: "USER" }, { status: { $in: "ACTIVE" } }]
            }
            var findResult = await userModel.findOne(query)
            if (findResult) {
                let otp = commonFunction.getOtp();
                let otpTime = new Date().getTime();
                let subject = " verify your otp";
                let text = `Dear ${findResult.firstName + " " + findResult.lastName}, Please verify your otp: ${otp},\notp will expires in 3 minutes`;
                var sendMailResult = await commonFunction.sendMail(findResult.email, subject, text)
                if (sendMailResult) {
                    var updateResult = await userModel.findByIdAndUpdate({ _id: findResult._id }, { $set: { otp: otp, otpTime: otpTime, otpVerify: false } }, { new: true })
                    if (updateResult) {
                        return res.send({ responseCode: 200, responseMessage: "Password forgot successfully....", responseResult: updateResult });
                    }

                }

            }

        } catch (error) {
            console.log(error);
            return res.send({ responseCode: 500, responseMessage: "server error" });
        }
    },
    userResetPassword: async (req, res) => {
        try {
            let query = {
                $and: [{ $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }] }, { userType: "USER" }, { status: { $in: "ACTIVE" } }]
            }
            var findResult = await userModel.findOne(query)
            if (findResult) {
                if (findResult.otpVerify != true) {
                    if (findResult.otp == req.body.otp) {
                        let otpTimeDifference = (new Date().getTime()) - findResult.otpTime;
                        if (otpTimeDifference <= (3 * 60 * 1000)) {
                            if (req.body.newPassword == req.body.confirmPassword) {
                                var updateResult = await userModel.findByIdAndUpdate({ _id: findResult._id }, { $set: { otpVerify: true, password: bcryptjs.hashSync(req.body.newPassword) } }, { new: true })
                                if (updateResult) {
                                    return res.send({ responseCode: 200, responseMessage: "Password reseted successfully....", responseResult: updateResult });
                                }

                            } else {
                                return res.send({ responseCode: 401, responseMessage: "Invalid credentials: Password and Confirm Password does't match" });
                            }
                        } else {
                            return res.send({ responseCode: 403, responseMessage: "otp time has been expired, Please try again....." });
                        }
                    } else {
                        return res.send({ responseCode: 400, responseMessage: "Invalid otp: try again...." });
                    }
                } else {
                    return res.send({ responseCode: 409, responseMessage: "Password already reset...." });
                }
            }

        } catch (error) {
            return res.send({ responseCode: 500, responseMessage: "server error" });
        }
    },
    userReSendOtp: async (req, res)=>{
        try{
            let query = {
                $and: [{$or: [{phoneNumber: req.body.phoneNumber}, {email: req.body.email}]}, {userType: "USER"}, {status: {$in: "ACTIVE"}}]
            }
            let findResult = await userModel.findOne(query);
            if(!findResult){
                return res.send({responseCode: 404, responseMessage: "user does't exist"});
            } else if(findResult){
                let otp = commonFunction.getOtp();
                let otpTime = new Date().getTime();
                let subject = " verify your otp";
                let text = `Dear ${findResult.firstName +" "+ findResult.lastName}, Please verify your otp: ${otp},\notp will expires in 3 minutes`;
                let sendMailResult = await commonFunction.sendMail(findResult.email, subject, text);
                if(sendMailResult){
                    let updateResult = await userModel.findByIdAndUpdate({_id: findResult._id}, {$set: {otp: otp, otpTime: otpTime, otpVerify: false}}, {new: true});
                    if(updateResult){
                        return res.send({responseCode: 200, responseMessage: "otp sent successfully....", responseResult: updateResult});
                    }
                }
            }
        } catch(error){

            return res.send({responseCode: 500, responseMessage: "server error"});
        }
    },
    userLogIn:async (req, res)=>{
        try{
            let query = {
                $and: [{$or: [{phoneNumber: req.body.phoneNumber}, {email: req.body.email}]}, {userType: "USER"}, {status: {$in: "ACTIVE"}}]
            }
        var findResult=await    userModel.findOne(query)
        if(findResult){
                    if(findResult.otpVerify == true && findResult.emailVerify==true){
                        let checkPassword = bcryptjs.compareSync(req.body.password, findResult.password);
                        if(checkPassword){
                          let token = jwt.sign({_id: findResult._id}, "manish", {expiresIn: "30m"});
                            return res.send({responseCode: 200, responseMessage: "Login successfully: Token has been generated....", responseResult: token});
                        } else{
                            return res.send({responseCode: 400, responseMessage: "Invalid Password: Please try again...."});
                        }
                    } else{
                        return res.send({responseCode: 400, responseMessage: "Your account is not verified yet, first verify your account...."});
                    }
                }
        
        } catch(error){
            console.log(error);
            return res.send({responseCode: 500, responseMessage: "server error"});
        }
    },


}