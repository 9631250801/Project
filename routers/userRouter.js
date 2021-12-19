const userRouter = require("express").Router();
const userController = require("../controllers/userController");

/** User SignUp Api's Routing */
/**
   * @swagger
   * /user/userSignUp:
   *   post:
   *     tags:
   *       - USER
   *     description: userSignUp Api
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: firstName
   *         description: firstName is required.
   *         in: formData
   *         required: true
   *       - name: lastName
   *         description: lastName
   *         in: formData
   *         required: false
   *       - name: phoneNumber
   *         description: phoneNumber is required.
   *         in: formData
   *         required: true
   *       - name: email
   *         description: email is required
   *         in: formData
   *         required: true
   *       - name: password
   *         description: password is required
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Signin  successfully
   *       404:
   *         description: Invalid credentials
   *       500:
   *         description: Internal Server Error
   */
userRouter.post("/userSignUp", userController.userSignUp);

/**
   * @swagger
   * /user/userOtpVerify:
   *   put:
   *     tags:
   *       - USER
   *     description: userOtpVerify Api
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         description: email is required.
   *         in: formData
   *         required: true
   *       - name: otp
   *         description: otp is required
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: userOtpVerify  successfully
   *       404:
   *         description: Invalid credentials
   *       500:
   *         description: Internal Server Error
   */
userRouter.put("/userOtpVerify", userController.userOtpVerify);

/**
   * @swagger
   * /user/userEmailVerification/{_id}:
   *   get:
   *     tags:
   *       - USER 
   *     description: User emailVerify Api
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: _id
   *         description: _id is required
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Email Verified successfully
   *       403:
   *         description: Email time has been expired
   *       404:
   *         description: Invalid credentials
   *       409:
   *         description: Email already verified
   *       500:
   *         description: Internal Server Error
   */


userRouter.get("/userEmailVerification/:_id", userController.userEmailVerification);

/**
   * @swagger
   * /user/userForgotPassword:
   *   put:
   *     tags:
   *       - USER
   *     description: userForgotPassword 
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         description: email is required.
   *         in: formData
   *         required: true
   *       
   *     responses:
   *       200:
   *         description: userForgotPassword  successfully
   *       404:
   *         description: Invalid credentials
   *       500:
   *         description: Internal Server Error
   */

 userRouter.put("/userForgotPassword", userController.userForgotPassword);

/**
   * @swagger
   * /user/userResetPassword:
   *   put:
   *     tags:
   *       - USER 
   *     description: userResetPassword
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: phoneNumber
   *         description: phoneNumber is required
   *         in: formData
   *         required: true
   *       - name: email
   *         description: email is required
   *         in: formData
   *         required: true
   *       - name: otp
   *         description: otp is required
   *         in: formData
   *         required: true
   *       - name: newPassword
   *         description: newPassword is required
   *         in: formData
   *         required: true
   *       - name: confirmPassword
   *         description: confirmPassword is required
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description:User Reset Password successfully
   *       403:
   *         description: Email time has been expired
   *       404:
   *         description: Invalid credentials
   *       409:
   *         description: Email already verified
   *       500:
   *         description: Internal Server Error
   */
 userRouter.put("/userResetPassword", userController.userResetPassword);
/**
   * @swagger
   * /user/userReSendOtp:
   *   put:
   *     tags:
   *       - USER 
   *     description: userReSendOtp
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: phoneNumber
   *         description: phoneNumber is required
   *         in: formData
   *         required: true
   *       - name: email
   *         description: email is required
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: otp userReSendOtp successfully
   *       404:
   *         description: Invalid credentials
   *       500:
   *         description: Internal Server Error
   */
 userRouter.put("/userReSendOtp", userController.userReSendOtp);


 /**
   * @swagger
   * /user/userLogIn:
   *   post:
   *     tags:
   *       - USER 
   *     description: userLogIn
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: phoneNumber
   *         description: phoneNumber is required
   *         in: formData
   *         required: true
   *       - name: email
   *         description: email is required
   *         in: formData
   *         required: true
   *       - name: password
   *         description: password is required.
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: userLogIn successfully
   *       403:
   *         description: otp time has been expired
   *       404:
   *         description: Invalid credentials
   *       500:
   *         description: Internal Server Error
   */
  userRouter.post("/userLogIn",userController.userLogIn)
module.exports = userRouter;