let nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "41cea1491001b1",
        pass: "4c1aa13c3bbcf7",
    },
});
module.exports = {
    sendMail: async function (to, password) {
        await transporter.sendMail({
            from: '"Môn Học NNPTUD" <admin@nnptud-course.com>',
            to: to,
            subject: "Welcome! Chào mừng đến với môn Ngôn ngữ phát triển ứng dụng mới",
            text: `Chào mừng bạn đến với môn Ngôn ngữ phát triển ứng dụng mới! Mật khẩu đăng nhập của bạn là: ${password}`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Welcome!</h2>
                <p>Chào mừng bạn đã đến với khóa học <strong>Ngôn ngữ phát triển ứng dụng mới</strong>.</p>
                <p>Tài khoản của bạn đã được khởi tạo thành công với mật khẩu dưới đây:</p>
                <div style="font-size: 20px; font-weight: bold; color: #007bff; margin: 15px 0;">
                    ${password}
                </div>
                <p>Chúc bạn học tốt!</p>
            </div>
            `,
        });
    }
}