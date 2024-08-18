const jwt = require('jsonwebtoken')
const hbs = require('hbs')
const User = require('../models/User.js')

authCheckMiddleware = async (request, response, next) => {
    try{
        if (request.cookies['token']){
            const userId = jwt.verify(request.cookies['token'].split(' ')[1], process.env.SECRET_KEY)
            request.body['userId'] = userId['_id']
            const user = await User.findById(userId)
            response.locals['user'] = user
        }
        next()
    }
    catch(err){
        console.log(err)

    }
}

module.exports = authCheckMiddleware