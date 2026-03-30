let nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, 
    auth: {
        user: "7f4c6e9a8d29bb", // Placeholder: REPLACE WITH YOUR MAILTRAP USER ID
        pass: "4f5e7a9b8c0d12", // Placeholder: REPLACE WITH YOUR MAILTRAP PASSWORD
    },
});
module.exports = {
    sendMail: async function (to, password) {
        await transporter.sendMail({
            from: '"Admin" <admin@nnptud.com>',
            to: to,
            subject: "Your New Account Password",
            text: `Welcome! Your random password is: ${password}. Please change it after logging in.`,
            html: `<h3>Welcome!</h3><p>Your random password is: <b>${password}</b></p><p>Please change it after logging in.</p>`,
        });
    }
}