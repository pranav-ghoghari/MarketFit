const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

/**
 * @route   POST /api/projects/createproject
 * @desc    Create a new project
 * @note    Expects ownerId in body
 */
router.post('/createproject', async (req, res) => {
  try {
    const { ownerId, name, description } = req.body;

    // Validate required fields (mongoose will also enforce)
    if (!ownerId || !name) {
      return res.status(400).json({
        success: false,
        error: 'ownerId and name are required'
      });
    }

    const project = await Project.create({
      ownerId,
      name,
      description
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    // Handle mongoose validation errors, cast errors, etc.
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
