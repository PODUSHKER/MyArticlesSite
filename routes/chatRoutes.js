const express = require('express')
const chatRouter = express.Router()
const chatControllers = require('../controllers/chatControllers.js')

chatRouter.get('/', chatControllers.getMessages)
chatRouter.post('/', chatControllers.postMessages)
chatRouter.get('/:id', chatControllers.getChat)
chatRouter.post('/:id', chatControllers.postChat)
chatRouter.post('/send/:id', chatControllers.sendMessage)


module.exports = chatRouter