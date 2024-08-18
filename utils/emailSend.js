const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: '465',
    secure: 'SSL',
    auth: {
        user: 'kirillkarelin2005@yandex.ru',
        pass: '-_-leon-_-2709'
    }
})

module.exports = transporter