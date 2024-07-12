// server/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  picture: {
    type: String,
    default: 'default-profile-picture.jpg', // Placeholder for default image
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  projects: {
    type: [String],
    default: [],
  },
  achievements: {
    type: [String],
    default: [],
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
