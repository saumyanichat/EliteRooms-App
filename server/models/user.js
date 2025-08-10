const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isHost :{
        type: Boolean,
        default: false
    }
});

const Userss = mongoose.model('User', userSchema);

module.exports = Userss;
