/**
 * Segmentation Grid Generation Utility
 * Converts audience descriptions into structured segmentation grids using OpenRouter API
 */

const generateSegmentationGrid = async (audience_prompt) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  // Define the JSON schema
  const schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "SegmentationGridResponse",
    "type": "object",
    "required": [
      "segmentation",
      "demographics",
      "regions",
      "languages",
      "psychographic",
      "hobbies",
      "purchaseDrivers"
    ],
    "additionalProperties": false,
    "properties": {
      "segmentation": {
        "type": "object",
        "required": ["roles"],
        "additionalProperties": false,
        "properties": {
          "roles": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1
          }
        }
      },
      "demographics": {
        "type": "object",
        "required": ["ageRange", "regions", "languages"],
        "additionalProperties": false,
        "properties": {
          "ageRange": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1
          },
          "regions": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1
          },
          "languages": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1
          }
        }
      },
      "regions": {
        "type": "array",
        "items": {"type": "string"},
        "minItems": 1
      },
      "languages": {
        "type": "array",
        "items": {"type": "string"},
        "minItems": 1
      },
      "psychographic": {
        "type": "object",
        "required": ["motivations", "hobbies", "purchaseDrivers"],
        "additionalProperties": false,
        "properties": {
          "motivations": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1
          },
          "hobbies": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1
          },
          "purchaseDrivers": {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1
          }
        }
      },
      "hobbies": {
        "type": "array",
        "items": {"type": "string"},
        "minItems": 1
      },
      "purchaseDrivers": {
        "type": "array",
        "items": {"type": "string"},
        "minItems": 1
      }
    }
  };

  // Prepare the prompt with instructions
  const promptWithInstructions = `${audience_prompt}
For each field in the segmentation grid, give **3–5 possible values**:
  • segmentation.roles  
  • demographics.ageRange  (e.g. "25–27", "28–30", "31–34")  
  • demographics.regions  
  • demographics.languages  
  • psychographic.motivations  
  • psychographic.hobbies  
  • psychographic.purchaseDrivers  
Return ONLY JSON that matches the schema exactly.`;

  try {
    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/o4-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that converts an audience description into a segmentation grid. Respond ONLY with JSON that satisfies the provided schema.'
          },
          { role: 'user', content: promptWithInstructions }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'segmentation_grid',
            strict: true,
            schema: schema
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON string from the model
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating segmentation grid:', error);
    throw error;
  }
};

module.exports = { generateSegmentationGrid };
