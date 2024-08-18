const expressHbs = require('express-handlebars')
const User = require('../models/User.js')


const hbsEngine = expressHbs.engine({
    layoutsDir: 'views/layouts',
    defaultLayout: 'base',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        getShortDescription(descr) {
            return descr.length > 60 ? descr.slice(0, 60) + '...' : descr
        },
        getTime(date){
            return new Date(date).toTimeString().split(' ')[0] + ' ' + new Date(date).toDateString().replace(/^[0-9a-zA-Z]+\s/, '')
        },
        isEqualId(a, b){
            
            return String(a) === String(b) || !b
        },
        timeSort(array){
            return array.sort((a, b) => a.createdAt - b.createdAt)
        },
        getMessageTime(message){
            return new Date(message.createdAt).toTimeString().match(/\d\d:\d\d/)||null
        },
    }
})

module.exports = hbsEngine