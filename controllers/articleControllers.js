const Article = require('../models/Article.js')
const { ObjectId } = require('mongoose').Types
const User = require('../models/User.js')
const Comment = require('../models/Comment.js')
const { validationResult } = require('express-validator')

exports.getArticles = async (request, response) => {
    try{
        let articles = await Article.find({}).populate('author').exec()
        if (request.query['search']) {
            articles = [...articles].filter(el => el.title.toLowerCase().includes(request.query['search'].toLowerCase()))
        }
        response.render('main.hbs', {title: 'Главная страница', articles})
    }
    catch(err){
        console.log('ne proshlo')
        console.log(err)
    }
}

exports.readArticle = async (request, response) => {
    try{
        const article = await Article.findById(request.params['id']).populate('author').exec()
        const comments = await Comment.find({article: new ObjectId(article._id)}).populate('author').exec()
        response.render('article.hbs', {title: article.title, article: article, comments})
    }
    catch(err){
        console.log(err)
    }
}

exports.createComment = async (request, response) => {
    try{
        const author = new ObjectId(request.body['userId']);
        const article = new ObjectId(request.params['id']);
        console.log(author, article);
        const comment = await new Comment({text: request.body['text'], author, article}).save()
        console.log(request.url)
        response.redirect(`${request.originalUrl}#${comment._id}`)
    }
    catch(err){
        console.log(err)
    }
}

exports.getCreate = async (request, response) => {
    try{
        response.render('create.hbs', {title: 'Создать статью'})
    }
    catch(err){
        console.log(err)
    }
}

exports.postCreate = async (request, response) => {
    const result = validationResult(request).array()
    try{
        if (!result.length){
            const article = new Article(request.body)
            article.image = request.file['filename']
            article.author = new ObjectId(request.body['userId'])
            await article.save()
            response.redirect('/')
        }
        response.cookie('errors', result)
        response.redirect(request.originalUrl)
    }
    catch(err){
        console.log(err)
    }
}


