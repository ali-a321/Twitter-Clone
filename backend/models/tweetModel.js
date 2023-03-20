const mongoose = require('mongoose')

const tweetSchema = mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", /* type: String, */ required: true }, 
    content: { type: String, maxLength: 400, required: true },
    timestamp: { type: Date, default: Date.now, },
    comments: [
        {
            text: { type: String},
            created: {type: Date, default: Date.now},
            postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ] ,
    postedBy:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    photo: {
        type: String,
        default: ''
    },
})

module.exports = mongoose.model('Tweet', tweetSchema)