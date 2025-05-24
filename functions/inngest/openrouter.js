const { inngest } = require('../../config/inngest');
const MarketFit = require('../../models/MarketFit');

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
