const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bio: {
        type: String,
        maxlength: 500
    },
    location: {
        type: String,
        maxlength: 100
    },
    website: {
        type: String,
        maxlength: 100
    },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    dateOfBirth: {
        type: Date
    },
    profilePicture: {
        type: String,
        default: 'default-profile-picture.png'
    },  
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
