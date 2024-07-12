const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Profile = require('./models/Profile');
const User = require('./models/User');
const Task = require('./models/Task'); // Include Task model

const app = express();
const PORT = process.env.PORT || 4000; // Port 4000
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret key

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/tech-pioneers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false // Disable deprecated findOneAndUpdate
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer storage configuration for handling profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Example route for creating a profile with file upload
app.post('/api/profiles', upload.single('profileImage'), async (req, res) => {
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
    res.status(201).json({ message: 'Profile created with file upload' });
  } catch (err) {
    console.error('Error creating profile:', err);
    res.status(500).json({ message: 'Error creating profile' });
  }
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login endpoint to generate JWT token
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Example route for creating a task
app.post('/api/tasks', async (req, res) => {
  const { title, description, assignedTo, status, deadline } = req.body;
  try {
    const task = new Task({ title, description, assignedTo, status, deadline });
    await task.save();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Serve static files (React build, if applicable)
const clientBuildPath = path.join(__dirname, 'client/build');
app.use(express.static(clientBuildPath));

// Handle production environment (React routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
