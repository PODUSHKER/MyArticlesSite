const mongoose = require('mongoose')
const User = require('./User.js')

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
        
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    messages: {
        type: Array,
        default: []
    }
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat