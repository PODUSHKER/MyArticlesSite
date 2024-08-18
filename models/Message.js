const mongoose = require('mongoose')
const User = require('./User.js')

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    text: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message