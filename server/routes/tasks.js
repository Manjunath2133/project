const express = require('express');
const Task = require('../models/Task');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Get all tasks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Get task by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, assignedTo, status, deadline } = req.body;
  const task = new Task({ title, description, assignedTo, status, deadline });
  try {
    await task.save();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update task by ID
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, assignedTo, status, deadline } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { title, description, assignedTo, status, deadline }, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete task by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
