const express = require('express');
const Profile = require('../models/Profile');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Set upload destination
  },
  filename: function (req, file, cb) {
    // Rename file if needed, you can customize this logic
    cb(null, file.originalname);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Example route for creating a profile with file upload
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const profile = new Profile({
      username: req.body.username,
      bio: req.body.bio,
      skills: req.body.skills,
      projects: req.body.projects,
      achievements: req.body.achievements,
      picture: req.file.path // Assuming 'profileImage' is the field name for the uploaded file
    });

    await profile.save();
    res.status(201).send('Profile created with file upload');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating profile with file upload');
  }
});

// Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching profiles');
  }
});

// Get profile by ID
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).send('Profile not found');
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching profile');
  }
});

// Update profile by ID
router.put('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profile) {
      return res.status(404).send('Profile not found');
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating profile');
  }
});

// Delete profile by ID
router.delete('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).send('Profile not found');
    }
    res.send('Profile deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting profile');
  }
});

module.exports = router;
