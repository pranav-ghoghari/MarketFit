const express = require('express');
const router = express.Router();
const inngestController = require('../controllers/inngest.controller');

/**
 * @route POST /api/inngest-api/test-single
 * @desc Test processing a single prompt with OpenRouter via Inngest
 * @access Public
 */
router.post('/test-single', inngestController.testSinglePrompt);

/**
 * @route POST /api/inngest-api/test-batch
 * @desc Test batch processing multiple prompts with OpenRouter via Inngest
 * @access Public
 */
router.post('/test-batch', inngestController.testBatchPrompts);

module.exports = router;
