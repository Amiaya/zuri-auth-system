const nodemailer = require('nodemailer')

const sendEmail = async options => {
    // 1) creating a transport 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // 2 define the email options
    const mailOptions = {
        from: 'Amiaya Boss <amiayaprime@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3 actually send the email
    await transporter.sendMail(mailOptions)

}

module.exports = sendEmail