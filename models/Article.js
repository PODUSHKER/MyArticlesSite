const { Schema, model, Types, default: mongoose } = require('mongoose')
const types = Schema.types;
const User = require('./User.js')

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 120
    }, 
    description: {
        type: String,
        required: true   
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: String,
    image: {
        type: String,
        default: ''
    }
}, {timestamps: true})

const Article = model('Article', articleSchema)

module.exports = Article