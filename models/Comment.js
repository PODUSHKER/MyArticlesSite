const mongoose = require('mongoose');
const User = require('./User.js')
const Article = require('./Article.js')

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Article
    }
}, {timestamps: true})

module.exports = mongoose.model('Comment', commentSchema)