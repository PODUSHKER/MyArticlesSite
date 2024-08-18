const { ObjectId } = require('mongoose').Types
const User = require('../models/User.js')
const Chat = require('../models/Chat.js')
const Message = require('../models/Message.js')

exports.getMessages = async (request, response) => {
    try{
        const chats = await Chat.find({sender: new ObjectId(request.body['userId'])}).populate('recipient').exec()
        response.render('messages.hbs', {title: 'Сообщения', chats})
    }
    catch(err){
        console.log(err)
    }
}

exports.postMessages = async (request, response) => {
    try{
        const userId = new ObjectId(request.body['userId'])
        const recipientId = new ObjectId(request.body['recipientId'])
        let chat = await Chat.findOne({recipient: recipientId, sender: userId})
        if (!chat){
            chat = await new Chat({sender: userId, recipient: recipientId}).save()
            await new Chat({sender: recipientId, recipient: userId}).save()
        }
        response.redirect(`/messages/${chat._id}`)
    }
    catch(err){
        console.log(err)
    }
}

exports.getChat = async (request, response) => {
    try{
        const chat = await Chat.findById(request.params['id']).populate('recipient').exec()
        const messages = [];
        for (let i of chat.messages){
            const obj = await Message.findById(i).populate('from').exec()
            messages.push(obj)
        }
        const chats = await Chat.find({sender: new ObjectId(request.body['userId'])}).populate('recipient').exec()
        response.render('messages.hbs', {title: 'Сообщения', chat, chats, messages})
    }
    catch(err){
        console.log(err)
    }
}

exports.postChat = async (request, response) => {
    try{
        response.end()
    }
    catch(err){
        console.log(err)
    }
}

exports.sendMessage = async (request, response) => {
    try{
        const text = request.body['text']
        const senderChat = await Chat.findById(request.params['id']).populate('recipient').exec()
        const recipientChat = await Chat.findOne({sender: senderChat.recipient, recipient: senderChat.sender})
        const message = await new Message({
            from: new ObjectId(senderChat.sender),
            to: new ObjectId(senderChat.recipient),
            text
        }).save()
        senderChat.messages = [...senderChat.messages, message]
        recipientChat.messages = [...recipientChat.messages, message]
        await senderChat.save()
        await recipientChat.save()
        response.json({success: true, message, user: response.locals['user']})
    }
    catch(err){
        console.log(err)
        response.json({success: false})
    }
}