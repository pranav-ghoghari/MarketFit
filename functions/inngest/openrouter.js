const { inngest } = require('../../config/inngest');
const MarketFit = require('../../models/MarketFit');
const Persona = require('../../models/Persona');

// This function will process a single OpenRouter request
exports.processOpenRouterRequest = inngest.createFunction(
  { id: 'process-openrouter-request' },
  { event: 'openrouter/process' },
  async ({ event, step }) => {
    const { prompt } = event.data;

    // 1) Call OpenRouter → Cerebras with Qwen3-32B
    const response = await step.run('call-openrouter', async () => {
      const apiKey = process.env.OPENROUTER_API_KEY;
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-32b',
          provider: { only: ['Cerebras'] },
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user',   content: prompt }
          ]
        })
      });
      if (!res.ok) {
        throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`);
      }
      return res.json();
    });

    // 2) Extract the assistant's reply and token usage
    const reply = response.choices?.[0]?.message?.content || '';
    const tokensUsed = response.usage?.total_tokens || 0;

    // 3) Persist to MongoDB
    const result = await step.run('save-to-mongodb', async () => {
      const entry = new MarketFit({
        name: `OpenRouter Cerebras Qwen3-32B: ${prompt.substring(0, 50)}...`,
        description: `Prompt: "${prompt}" – Response: "${reply.substring(0, 490)}"`,
        value: tokensUsed,
        isActive: true
      });
      return entry.save();
    });

    return { success: true, result };
  }
);

// This function will batch process multiple OpenRouter requests
exports.batchProcessOpenRouterRequests = inngest.createFunction(
  { id: 'batch-process-openrouter-requests' },
  { event: 'openrouter/batch-process' },
  async ({ event, step }) => {
    const { prompts } = event.data;

    // fire off each individual job
    await step.run('process-prompts', async () => {
      const promises = prompts.map(prompt =>
        inngest.send({
          name: 'openrouter/process',
          data: { prompt }
        })
      );
      await Promise.all(promises);
    });

    return { success: true, count: prompts.length };
  }
);

// This function generates a backstory for a single persona
exports.generatePersonaBackstory = inngest.createFunction(
  { id: 'generate-persona-backstory' },
  { event: 'persona/generate-backstory' },
  async ({ event, step }) => {
    const { persona } = event.data;

    // Extract persona attributes for the prompt
    const promptData = {
      role: persona.segmentation.roles[0] || '',
      ageRange: persona.segmentation.demographics.ageRange || '',
      region: persona.segmentation.demographics.regions[0] || '',
      language: persona.segmentation.demographics.languages[0] || '',
      motivation: persona.segmentation.psychographics.motivations[0] || '',
      hobby: persona.segmentation.psychographics.hobbies[0] || '',
      purchaseDriver: persona.segmentation.psychographics.purchaseDrivers[0] || ''
    };

    // Build the prompt
    const promptLines = [
      "Convert the following characteristics into a vivid, realistic persona paragraph:",
      `- Role: ${promptData.role}`,
      `- Age Range: ${promptData.ageRange}`,
      `- Region: ${promptData.region}`,
      `- Language: ${promptData.language}`,
      `- Motivation: ${promptData.motivation}`,
      `- Hobby: ${promptData.hobby}`,
      `- Purchase Driver: ${promptData.purchaseDriver}`,
    ];
    const prompt = promptLines.join("\n");

    // Call OpenRouter → Cerebras with Qwen3-32B
    const response = await step.run('call-openrouter-for-backstory', async () => {
      const apiKey = process.env.OPENROUTER_API_KEY;
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-32b',
          provider: { only: ['Cerebras'] },
          messages: [
            { 
              role: 'system', 
              content: (
                "You are a persona-crafting assistant. "
                + "Whenever given a set of profile attributes, you must:\n"
                + "1. Assign a realistic first and last name.\n"
                + "2. Write a short backstory explaining their background and how they arrived in their role.\n"
                + "3. Weave all provided attributes into a single, engaging paragraph."
              )
            },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!res.ok) {
        throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`);
      }
      return res.json();
    });

    // Extract the assistant's reply
    const backstory = response.choices?.[0]?.message?.content || '';

    // Update the persona with the backstory
    const result = await step.run('update-persona-backstory', async () => {
      return Persona.findByIdAndUpdate(
        persona._id,
        { backstory },
        { new: true }
      );
    });

    return { success: true, personaId: persona._id, backstory };
  }
);

// This function processes all personas in a set
exports.batchGeneratePersonaBackstories = inngest.createFunction(
  { id: 'batch-generate-persona-backstories' },
  { event: 'persona/batch-generate-backstories' },
  async ({ event, step }) => {
    const { personasetId } = event.data;

    // Find all personas with the given setId
    const personas = await step.run('find-personas', async () => {
      return Persona.find({ setId: personasetId });
    });

    // Queue a backstory generation job for each persona
    await step.run('queue-backstory-generation', async () => {
      const promises = personas.map(persona => 
        inngest.send({
          name: 'persona/generate-backstory',
          data: { persona }
        })
      );
      await Promise.all(promises);
    });

    return { 
      success: true, 
      personasetId, 
      count: personas.length 
    };
  }
);
