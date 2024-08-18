const { body } = require('express-validator')
const User = require('../models/User.js')
const bcrypt = require('bcrypt')


const loginValidators = [
    body('login', 'Слишком длинный логин (max 255)!').isLength({max: 255}),
    body('login').custom(async (value) => {
        if (value){
            const user = await User.findOne({login: value, isAccept:true})
            if (!user){
                console.log(user, 'proshel')
                throw new Error('Логин введён неверно!')
            }
        }
        else{
            throw new Error('Введите логин!')
        }
        
    }),
    body('password', 'Слишком длинный пароль (max 255)!').isLength({max: 255}),
    body('password').custom(async (value, { req }) => {
        if (value){
            const user = await User.findOne({login: req.body.login})
            const isValid = user ? await bcrypt.compare(value, user.password) : null
            if (!isValid){
                throw new Error('Пароль введён неверно!')
            }
        }
        else{
            throw new Error('Введите пароль!')
        }
        
    }),
]

const registerValidators = [
    body('login', 'Слишком длинный логин (max 255)!').isLength({max: 255}),
    body('login', 'Введите логин!').notEmpty(),
    body('login').custom(async (value) => {
        if (value){
            const user = await User.findOne({login: value})
            if (user){
                console.log(user, 'proshel')
                throw new Error('Такой логин занят!')
            }
        }
        else{
            throw new Error('Введите логин!')
        }
        
    }),
    body('password', 'Слишком длинный пароль (max 255)!').isLength({max: 255}),
    body('password', 'Введите пароль!').notEmpty(),
    body('email').custom(async (value) => {
        if (value){
            const user = await User.findOne({email: value})
            if (user){
                console.log(user, 'proshel')
                throw new Error('Такой email занят!')
            }
        }
        else{
            throw new Error('Введите email!')
        }
    }),
    body('username', 'Введите имя пользователя!').notEmpty(),
    body('username', 'Слишком длинное имя пользователя (max 255)!').isLength({max: 255})
]

const articleValidators = [
    body('title', 'Введите заголовок!').notEmpty(),
    body('title', 'Слишком длинный заголовок (max 120)!').isLength({max: 120}),
    body('image').custom(async (value, { req }) => {
        if (!req.file){
            throw new Error('Загрузите изображение статьи!')
        }
    }),
    body('description', 'Заполните описание!').notEmpty()
]


module.exports = {
    loginValidators,
    registerValidators,
    articleValidators
}