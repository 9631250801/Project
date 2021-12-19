const nodemailer = require("nodemailer");

module.exports = {
    async sendMail(email, subject, text) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "...................@gmail.com",
                pass: "...................@"
            }
        });
        const mailOptions = {
            from: "vatsmonster0143@gmail.com",
            to: email,
            subject: subject,
            text: text
        }
        var result = await transporter.sendMail(mailOptions)
        if (result) {
            console.log("Email sent: " + result.response);
            return (null, result.response);

        }

    },
    getOtp() {
        let otp = Math.floor((Math.random() * 100000) + 100000);
        return otp;
    },



}