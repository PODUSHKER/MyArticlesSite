const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User.js')
const Article = require('../models/Article.js')
const { ObjectId } = require('mongoose').Types
const fs = require('fs').promises
const Notification = require('../models/Notification.js')
const transporter = require('../utils/emailSend.js')
const Message = require('../models/Message.js')
const Chat = require('../models/Chat.js')

exports.getLogin = async (request, response) => {
    try{        
        response.render('login.hbs', {title: 'Вход'})
    }
    catch(err){
        response.redirect(request.url)
    }
}

exports.postLogin = async (request, response) => {
    const result  = validationResult(request).array()
    try{
        const { login, password } = request.body
        if (!result.length){
            const user = await User.findOne({
                login,
                isAccept: true
            })
            const token = jwt.sign(
                {
                    _id: user._id,
                }, process.env.SECRET_KEY, {expiresIn: '24h'}
            )
            response.cookie('token', `Bearer ${token}`)
            response.redirect('/')
        }
        response.cookie('errors', result)
        response.redirect(request.originalUrl)
    }
    catch(err){
        console.log(err)
    }
}

exports.getRegister = async (request, response) => {
    try{
        response.render('register.hbs', {title: 'Регистрация'})
    }
    catch(err){
        console.log(err)
    }
}

exports.postRegister = async (request, response) => {
    const { username, login, email, password } = request.body;
    const result = validationResult(request).array()
    try{
        if (!result.length){
            const salt = bcrypt.genSaltSync(7)
            const hash = bcrypt.hashSync(password, salt)
            const user = await new User({ username, email, login, password: hash, }).save()
            const notification = await new Notification({user: user._id}).save()
            setTimeout(() => Notification.deleteOne({_id: notification._id}), 60*1000)
            await transporter.sendMail({
                from: 'kirillkarelin2005@yandex.ru',
                to: email,
                subject: 'Verify your password!',
                html: `Please click <a href="http://localhost:3000/user/auth/confirmVerify/${notification._id}">http://localhost:3000/user/auth/confirmVerify/${notification._id}</a> to confirm your email!`
            })
            response.render('verify.hbs')
        }
        else{
            response.cookie('errors', result)
            response.redirect(request.originalUrl)
        }
    }
    catch(err){
        console.log(err)
    }
}

exports.userLogout = async (request, response) => {
    console.log('im here')
    try{
        console.log('not penis')
        response.clearCookie('token')
        response.redirect('/')
    }
    catch(err){
        console.log('penis')
        console.log(err)
    }
}

exports.getProfile = async (request, response) => {
    try{
        const articles = await Article.find({author: new ObjectId(request.body['userId'])}).populate('author').exec()
        response.render('profile.hbs', {title: 'Профиль', articles: articles})
    }
    catch(err){
        console.log(err)
    }
}

exports.postProfile = async (request, response) => {
    try{
        const user = await User.findById(request.body['userId'])
        const { username, email } = request.body;
        let image = user.image

        if (request['file']){
            image = request.file['filename']
            if (user.image){
                await fs.unlink(`public/media/img/${user.image}`)
            }
        }

        await User.updateOne({_id: new ObjectId(request.body['userId'])}, {$set: { username, email, image }})
        response.redirect('/user/profile')
    }
    catch(err){
        console.log(err)
    }
}

exports.getOtherPersonProfile = async (request, response) => {
    try{
        const person = await User.findById(request.params['id'])
        const articles = await Article.find({author: person._id}).populate('author').exec()
        response.render('otherPersonProfile.hbs', {person, articles})
    }
    catch(err){
        console.log(err)
    }
}

exports.confirmVerify = async (request, response) => {
    try{
        const id = request.params['id']
        const notification = await Notification.findOne({_id: new ObjectId(id)}).populate('user').exec()
        const user = notification.user;
        user.isAccept = true;
        user.save()
        await Notification.deleteOne({_id: notification._id})
        response.render('confirmVerify.hbs', {username: user.username})
    }
    catch(err){
        console.log(err)
    }
}
