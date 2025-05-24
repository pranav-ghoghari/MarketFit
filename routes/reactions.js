const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reaction.controller');

/**
 * @route POST /api/reactions
 * @desc Generate reactions for all personas in a set for a specific campaign
 * @access Public
 */
router.post('/', reactionController.generateReactions);

module.exports = router;
