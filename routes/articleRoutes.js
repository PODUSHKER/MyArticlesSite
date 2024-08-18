const express = require('express')
const articleRouter = express.Router()
const articleControllers = require('../controllers/articleControllers.js')
const { articleValidators } = require('../utils/validators.js')


articleRouter.get('/', articleControllers.getArticles)
articleRouter.get('/create', articleControllers.getCreate)
articleRouter.post('/create', articleValidators, articleControllers.postCreate)
articleRouter.get('/article/:id', articleControllers.readArticle)
articleRouter.post('/article/:id', articleControllers.createComment)


module.exports = articleRouter