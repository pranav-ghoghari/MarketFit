const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller');

/**
 * @route POST /api/personas/generate-backstories
 * @desc Generate backstories for all personas in a set
 * @access Public
 */
router.post('/generate-backstories', personaController.generatePersonaBackstories);

module.exports = router;
