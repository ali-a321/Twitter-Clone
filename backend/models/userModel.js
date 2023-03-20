const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: { type: String, maxLength: 30, required: [true, 'Please add a name']},
    lastname: { type: String, maxLength: 30, required: [true, 'Please add a name' ]},
    username: { type: String, maxLength: 20, required: true, unique: true },
    password: { type: String, minLength: 6, required: [true, 'Please add a password']},
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    followings: [{type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    profilePicture: { type: String, default: "", },
    coverPicture: { type: String, default: "", },
    bio: { type: String, maxLength: 200, default: "", },
    datejoined: { type: Date, default: Date.now, },
    verified:{type: Boolean, default: false,},
})


module.exports = mongoose.model('User', userSchema)