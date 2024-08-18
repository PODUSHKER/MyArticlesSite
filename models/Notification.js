const mongoose = require('mongoose')
const User = require('./User.js')

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, {timestamps: true})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification