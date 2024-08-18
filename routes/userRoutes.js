const express = require('express')
const userRouter = express.Router()
const userControllers = require('../controllers/userControllers.js')
const { loginValidators, registerValidators } = require('../utils/validators.js')

userRouter.get('/auth/login', userControllers.getLogin)
userRouter.post('/auth/login', loginValidators, userControllers.postLogin)

userRouter.get('/auth/register', userControllers.getRegister)
userRouter.post('/auth/register', registerValidators,  userControllers.postRegister)
userRouter.get('/auth/confirmVerify/:id', userControllers.confirmVerify)

userRouter.get('/auth/logout', userControllers.userLogout)
userRouter.get('/profile', userControllers.getProfile)
userRouter.post('/profile', userControllers.postProfile)
userRouter.get('/profile/:id', userControllers.getOtherPersonProfile)


module.exports = userRouter