const nodemailer = require('nodemailer')

exports.sendEmail = (to, subject, html) => {
    try {
        let transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        const message = {
            from: process.env.SMTP_USER,
            to, subject, html
        }

        transport.sendMail(message, function (err, info) {
            if (err) {
                console.log(err)
                return false
            } else {
                return true
            }
        })
    } catch (error) {
        return false
    }

}

exports.passwordResetHTML = (passwordResetToken) => {
    const link = process.env.PASSWORD_RESET_LINK + "/" + passwordResetToken
    return `<html><body><p style='font-weight: bold;font-size: 20px;'>Password Keeper</p><hr><p style='text-align: center;font-weight: bold;color: #5f5f5f;'> Please click the link below to reset your password</p><p style = 'text-align: center;font-weight: bold;font-size: 20px;'><a href='${link}'>${link}</a></p></body></html>`
}