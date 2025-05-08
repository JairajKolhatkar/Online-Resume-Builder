const express = require('express');
const router = express.Router();
const Resume = require('../../models/Resume');
const User = require('../../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ msg: 'Not authorized, please login' });
  }
  next();
};

// @route   GET api/resumes
// @desc    Get all resumes for current user
// @access  Private
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.session.userId })
      .sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/resumes/:id
// @desc    Get resume by ID
// @access  Private
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    
    // Check if user owns this resume
    if (resume.user.toString() !== req.session.userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/resumes
// @desc    Create a new resume
// @access  Private
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const newResume = new Resume({
      ...req.body,
      user: req.session.userId
    });

    const resume = await newResume.save();
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/resumes/:id
// @desc    Update a resume
// @access  Private
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);
    
    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    
    // Check if user owns this resume
    if (resume.user.toString() !== req.session.userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update the resume
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };
    
    resume = await Resume.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      { new: true }
    );
    
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/resumes/:id
// @desc    Delete a resume
// @access  Private
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    
    // Check if user owns this resume
    if (resume.user.toString() !== req.session.userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await resume.remove();
    res.json({ msg: 'Resume removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 