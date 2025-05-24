const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const PersonaSet = require('../models/PersonaSet');
const Project = require('../models/Project');

/**
 * @route   POST /api/campaigns/createcampaign
 * @desc    Create a new campaign + auto-make its personaSet
 * @access  Public
 */
router.post('/createcampaign', async (req, res) => {
  try {
    const { projectId, title, copy, targetDescription, sampleSize } = req.body;

    // 1) Validate required
    if (!projectId || !title) {
      return res.status(400).json({ success: false, error: 'projectId and title are required' });
    }

    // 2) Lookup project to get owner
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // 3) Create an empty PersonaSet for this campaign
    const personaSet = await PersonaSet.create({
      ownerId: project.ownerId,
      name: `${title} Personas`,
      description: targetDescription || `Auto-generated for campaign "${title}"`
    });

    // 4) Create the Campaign with that personaSet ID
    const campaign = await Campaign.create({
      projectId,
      title,
      copy,
      targetDescription,
      sampleSize,
      personaSetIds: [ personaSet._id ]
    });

    res.status(201).json({
      success: true,
      data: { campaign, personaSetId: personaSet._id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
